// app/customers/page.tsx
"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { MenuApi } from "@/consts/api";
import { Menu } from "@/validations/menu-validation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useCartStore } from "@/store/cart-store"; // Path import yang benar
import Link from "next/link";
import { useState, useEffect } from "react";

const Customers = () => {
  const { data, isLoading, isError } = useQuery<Menu[]>({
    queryKey: ["menus"],
    queryFn: async () => {
      const response = await axios.get<Menu[]>(MenuApi.GetAll);
      return response.data;
    },
  });

  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  const handleAddToCart = (menu: Menu) => {
    addItem(menu);
    setPopupMessage(`${menu.name} ditambahkan ke keranjang!`);
    setShowPopup(true);
  };

  const isMenuInCart = (menuId: string) => {
    return cartItems.some((item) => item.id === menuId);
  };

  if (isLoading)
    return <p className="text-center p-8 text-xl text-gray-600">Loading...</p>;
  if (isError)
    return (
      <p className="text-center p-8 text-xl text-red-500">
        Terjadi kesalahan saat fetch data.
      </p>
    );

  return (
    <div className="container mx-auto px-4 py-8 relative text-white min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-white">
        Our Menu
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {data?.map((menu) => (
          <Card
            key={menu.id}
            className="shadow-xl rounded-2xl overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl flex flex-col h-full bg-gray-800 border border-gray-700"
          >
            <CardHeader className="border-b border-gray-600">
              <h2 className="text-2xl font-extrabold text-white leading-tight">
                {menu.name}
              </h2>
              <p className="text-sm font-medium text-gray-400 mt-1">
                {menu.category}
              </p>
            </CardHeader>
            <CardContent className="flex-grow p-0 relative">
              <Image
                src={menu.imageUrl}
                alt={menu.name}
                className="w-full h-48 object-cover object-center"
                width={400}
                height={300}
                priority
              />
              <div className="p-4 flex flex-col">
                <p className="text-gray-300 text-sm mt-2 line-clamp-2">
                  {menu.description}
                </p>
                <div className="flex justify-between items-end mt-4">
                  <p className="text-2xl font-bold text-green-500">
                    Rp {menu.price.toLocaleString("id-ID")}
                  </p>
                  <p className="text-sm text-gray-400">
                    Stock: <span className="font-semibold">{menu.stock}</span>
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex space-x-2">
              {isMenuInCart(menu.id) ? (
                <Link
                  href="/cart"
                  className="flex-1 py-3 text-center bg-green-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-75"
                >
                  Lihat di Keranjang
                </Link>
              ) : (
                <button
                  onClick={() => handleAddToCart(menu)}
                  className="flex-1 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
                >
                  Tambah Keranjang
                </button>
              )}
              <Link
                href={`/${menu.id}`}
                className="flex-1 py-3 text-center bg-gray-700 text-gray-200 font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-75"
              >
                Lihat Menu
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      {showPopup && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-lg z-50 transition-all duration-300 transform animate-fade-in">
          <p>{popupMessage}</p>
        </div>
      )}
    </div>
  );
};

export default Customers;
