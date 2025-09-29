"use client";
import React from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Table } from "@/types/orders";

interface FullOrder {
  id: string;
  status: string;
  createdAt: string;
  customerId: string; // Properti ini yang hilang
  tableId: string | null; // Properti ini juga hilang
  Table: Table | null;
  Customer: {
    id: string;
    username: string;
    phone: string;
  } | null;
  orderItems: {
    id: string;
    quantity: number;
    notes: string | null;
    menu: {
      name: string;
      price: number;
    };
  }[];
}

interface OrderSummaryClientProps {
  order: FullOrder;
}

const OrderSummaryClient: React.FC<OrderSummaryClientProps> = ({ order }) => {
  const handlePrint = () => {
    window.print();
  };

  const calculateTotal = () => {
    return order.orderItems.reduce(
      (sum, item) => sum + item.quantity * item.menu.price,
      0
    );
  };

  const tableInfo = order.tableId
    ? `Dine In (Meja ${order.Table?.number || "N/A"})`
    : "Takeaway";

  return (
    <div className="container mx-auto px-4 py-8 text-gray-200 min-h-screen">
      <div className="max-w-xl mx-auto p-8 bg-gray-800 shadow-lg rounded-lg print:shadow-none">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          Struk Pesanan
        </h1>

        <div className="border-b border-gray-700 pb-4 mb-4">
          <p className="text-gray-400">
            <span className="font-semibold">Tanggal:</span>{" "}
            {format(new Date(order.createdAt), "dd MMMM yyyy, HH:mm", {
              locale: id,
            })}
          </p>
          <p className="text-gray-400">
            <span className="font-semibold">Nomor Pesanan:</span>{" "}
            {order.id.substring(0, 8)}
          </p>
          <p className="text-gray-400">
            <span className="font-semibold">Tipe:</span> {tableInfo}
          </p>
          <p className="text-gray-400">
            <span className="font-semibold">Pelanggan:</span>{" "}
            {order.Customer?.username ?? "N/A"}
          </p>
        </div>

        <div className="space-y-4">
          {order.orderItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-white">{item.menu.name}</p>
                <p className="text-sm text-gray-400">
                  {item.quantity} x Rp {item.menu.price.toLocaleString("id-ID")}
                  {item.notes && (
                    <span className="ml-2 text-gray-400">({item.notes})</span>
                  )}
                </p>
              </div>
              <p className="font-semibold text-white">
                Rp {(item.quantity * item.menu.price).toLocaleString("id-ID")}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-700">
          <div className="flex justify-between text-xl font-bold text-white">
            <p>Total</p>
            <p>Rp {calculateTotal().toLocaleString("id-ID")}</p>
          </div>
        </div>

        <div className="mt-8 text-center print:hidden">
          <button
            onClick={handlePrint}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition-colors"
          >
            Cetak Struk
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryClient;
