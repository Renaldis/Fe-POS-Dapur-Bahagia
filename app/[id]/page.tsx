import React from "react";
import axios from "axios";
import { MenuApi } from "@/consts/api";
import { Menu } from "@/validations/menu-validation";
import DetailMenuClient from "./_components/DetailMenu";

interface MenuDetailPageProps {
  params: {
    id: string;
  };
}

const MenuDetailPage = async ({ params }: MenuDetailPageProps) => {
  const { id } = await params;

  try {
    const response = await axios.get<Menu>(`${MenuApi.GetById}/${id}`);
    const menu = response.data;

    return <DetailMenuClient menu={menu} />;
  } catch (error) {
    return (
      <p className="text-center p-8 text-xl text-red-500">
        Menu tidak ditemukan atau terjadi kesalahan.
      </p>
    );
  }
};

export default MenuDetailPage;
