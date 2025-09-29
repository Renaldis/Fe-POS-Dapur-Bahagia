"use client";

import React from "react";
import { Menu } from "@/validations/menu-validation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";

interface DetailMenuClientProps {
  menu: Menu;
}

const DetailMenuClient: React.FC<DetailMenuClientProps> = ({ menu }) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl min-h-screen text-white">
      <Card className="shadow-xl rounded-2xl overflow-hidden flex flex-col md:flex-row bg-gray-800 border border-gray-700">
        <div className="w-full md:w-1/2 p-4">
          <Image
            src={menu.imageUrl}
            alt={menu.name}
            width={600}
            height={400}
            className="w-full h-auto object-cover rounded-xl"
            priority
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-between p-6 md:p-8">
          <CardHeader className="p-0 mb-4">
            <h1 className="text-4xl font-extrabold text-white">{menu.name}</h1>
            <p className="text-lg font-medium text-gray-400 mt-2">
              {menu.category}
            </p>
          </CardHeader>
          <CardContent className="flex-grow p-0">
            <p className="text-gray-200 text-base leading-relaxed mb-4">
              {menu.description}
            </p>
            <div className="flex justify-between items-center mb-4">
              <p className="text-3xl font-bold text-green-500">
                Rp {menu.price.toLocaleString("id-ID")}
              </p>
              <p className="text-sm text-gray-400">
                Stock: <span className="font-semibold">{menu.stock}</span>
              </p>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default DetailMenuClient;
