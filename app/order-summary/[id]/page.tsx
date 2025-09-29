// app/order-summary/[id]/page.tsx
import React from "react";
import axios from "axios";
import { notFound } from "next/navigation";
import OrderSummaryClient from "./_components/OrderSummaryClient";
import { TTable as Table } from "@/validations/table-validation";

// Perbaiki interface agar sesuai dengan respons backend
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

interface OrderSummaryPageProps {
  params: {
    id: string;
  };
}

const OrderSummaryPage = async ({ params }: OrderSummaryPageProps) => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  async function getOrderDetails(orderId: string): Promise<FullOrder> {
    const response = await axios.get<FullOrder>(
      `${backendUrl}/api/v1/orders/${orderId}`
    );
    return response.data;
  }

  let order: FullOrder;
  try {
    order = await getOrderDetails(params.id);
  } catch (error) {
    return notFound();
  }

  return <OrderSummaryClient order={order} />;
};

export default OrderSummaryPage;
