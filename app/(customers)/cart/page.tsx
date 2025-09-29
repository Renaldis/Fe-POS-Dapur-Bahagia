// app/cart/page.tsx
"use client";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface Table {
  id: string;
  number: number;
  status: string;
  capacity: number;
}

const Cart = () => {
  const router = useRouter();
  const {
    items,
    totalPrice,
    incrementQuantity,
    decrementQuantity,
    updateNote,
    clearCart,
  } = useCartStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedTableId, setSelectedTableId] = useState<string>("");
  const [orderType, setOrderType] = useState<"dine-in" | "takeaway">("dine-in");

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const { data: availableTables, isLoading: isLoadingTables } = useQuery<
    Table[]
  >({
    queryKey: ["availableTables"],
    queryFn: async () => {
      const response = await axios.get<Table[]>(`${backendUrl}/api/v1/tables`);
      return response.data.filter((table) => table.status === "available");
    },
    enabled: orderType === "dine-in",
  });

  const handleCheckout = async () => {
    setIsProcessing(true);
    setErrorMessage("");

    if (!username || !phone) {
      setErrorMessage("Username dan nomor telepon harus diisi.");
      setIsProcessing(false);
      return;
    }

    if (orderType === "dine-in" && !selectedTableId) {
      setErrorMessage("Silakan pilih nomor meja.");
      setIsProcessing(false);
      return;
    }

    try {
      const customerResponse = await axios.post(
        `${backendUrl}/api/v1/customers`,
        {
          username,
          phone,
        }
      );
      const customerId = customerResponse.data.id;

      const orderResponse = await axios.post(`${backendUrl}/api/v1/orders`, {
        customerId,
        tableId: orderType === "dine-in" ? selectedTableId : null,
      });
      const orderId = orderResponse.data.id;

      for (const item of items) {
        await axios.post(`${backendUrl}/api/v1/order-items`, {
          orderId,
          menuId: item.id,
          quantity: item.quantity,
          notes: item.note || "",
        });
      }

      // Bersihkan keranjang dan alihkan ke halaman ringkasan pesanan
      clearCart();
      router.push(`/order-summary/${orderId}`);
    } catch (error) {
      console.error("Gagal membuat pesanan:", error);
      setErrorMessage("Gagal membuat pesanan. Silakan coba lagi.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Keranjang Pesanan
      </h1>
      {items.length === 0 ? (
        <p className="text-center text-gray-500">Keranjang Anda kosong.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Card
                key={item.id}
                className="shadow-lg rounded-xl flex flex-col"
              >
                <CardHeader className="flex-row items-center space-x-4 border-b pb-4">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                  <div>
                    <h2 className="text-xl font-bold">{item.name}</h2>
                    <p className="text-gray-600">
                      Rp {item.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 flex-grow">
                  <div className="flex items-center space-x-2 mb-4">
                    <label className="text-sm font-medium">Jumlah:</label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => decrementQuantity(item.id)}
                        className="px-2 py-1 rounded-md cursor-pointer scale-105 bg-slate-700 hover:bg-slate-800"
                      >
                        -
                      </button>
                      <span className="font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => incrementQuantity(item.id)}
                        className="px-2 py-1 rounded-md cursor-pointer scale-105 bg-slate-700 hover:bg-slate-800"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor={`note-${item.id}`}
                      className="text-sm font-medium"
                    >
                      Catatan:
                    </label>
                    <textarea
                      id={`note-${item.id}`}
                      value={item.note || ""}
                      onChange={(e) => updateNote(item.id, e.target.value)}
                      className="mt-1 w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
                      placeholder="Contoh: Tanpa bawang, pedas"
                      rows={2}
                    />
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <p>Subtotal:</p>
                    <p>
                      Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8 p-6 shadow-xl rounded-xl">
            <CardHeader className="pb-4">
              <h3 className="text-xl font-bold">Informasi Pesanan</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Tipe Pesanan</label>
                <div className="flex mt-1 space-x-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="dine-in"
                      name="orderType"
                      value="dine-in"
                      checked={orderType === "dine-in"}
                      onChange={() => setOrderType("dine-in")}
                      className="mr-2"
                    />
                    <label htmlFor="dine-in">Dine In</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="takeaway"
                      name="orderType"
                      value="takeaway"
                      checked={orderType === "takeaway"}
                      onChange={() => setOrderType("takeaway")}
                      className="mr-2"
                    />
                    <label htmlFor="takeaway">Takeaway</label>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 w-full p-2 border rounded-md"
                  placeholder="Masukkan username"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Nomor Telepon</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full p-2 border rounded-md"
                  placeholder="Masukkan nomor telepon"
                />
              </div>

              {orderType === "dine-in" && (
                <div>
                  <label className="text-sm font-medium text-gray-200">
                    Pilih Meja
                  </label>
                  {isLoadingTables ? (
                    <p className="mt-2 text-gray-400">Memuat meja...</p>
                  ) : (
                    <select
                      value={selectedTableId}
                      onChange={(e) => setSelectedTableId(e.target.value)}
                      className="mt-1 w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="" className="bg-gray-700">
                        -- Pilih Meja --
                      </option>
                      {availableTables?.map((table) => (
                        <option
                          key={table.id}
                          value={table.id}
                          className="bg-gray-700 text-white"
                        >
                          Meja {table.number} (Kapasitas {table.capacity})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col mt-4">
              <div className="flex justify-between items-center w-full mb-4">
                <h3 className="text-xl font-bold">Total Harga:</h3>
                <p className="text-2xl font-extrabold text-green-700">
                  Rp {totalPrice.toLocaleString("id-ID")}
                </p>
              </div>
              {errorMessage && (
                <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
              )}
              <button
                onClick={handleCheckout}
                disabled={
                  isProcessing || (orderType === "dine-in" && isLoadingTables)
                }
                className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:bg-gray-400"
              >
                {isProcessing
                  ? "Memproses Pesanan..."
                  : "Lanjutkan ke Pembayaran"}
              </button>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  );
};

export default Cart;
