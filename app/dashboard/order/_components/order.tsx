"use client";

import DataTable from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { HEADER_TABLE_ORDER } from "@/constants/order-constant";
import useDataTable from "@/hooks/use-data-table";
import { useQuery } from "@tanstack/react-query";
import { Ban, Link2Icon, ScrollText } from "lucide-react";
import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import DropdownAction from "@/components/common/dropdown-action";
import Link from "next/link";
import { Order } from "@/types/orders";

const OrderManagement = () => {
  const {
    currentPage,
    currentLimit,
    currentSearch,
    handleChangePage,
    handleChangeLimit,
    handleChangeSearch,
  } = useDataTable();

  const {
    data: orders,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders?page=${currentPage}&limit=${currentLimit}&search=${currentSearch}`
      );
      if (!res.ok) throw new Error("Gagal fetch data orders");
      return res.json();
    },
  });

  console.log(orders);

  // 🔑 Hitung total pages pakai useMemo sebelum kondisi return
  const totalPages = useMemo(() => {
    return orders && orders.count !== null
      ? Math.ceil(orders.count / currentLimit)
      : 0;
  }, [orders, currentLimit]);

  const reservedActionList = [
    {
      label: (
        <span className="flex items-center gap-2">
          <Link2Icon />
          Process
        </span>
      ),
      action: (orderId: string, tableId: string) => {
        console.log("Process order", orderId, "on table", tableId);
      },
    },
    {
      label: (
        <span className="flex items-center gap-2">
          <Ban className="text-red-500" />
          Cancel
        </span>
      ),
      action: (orderId: string, tableId: string) => {
        console.log("Cancel order", orderId, "on table", tableId);
      },
    },
  ];

  // 🔑 Filtered data juga sebelum return
  const filteredData = useMemo(() => {
    return (orders?.data || []).map((order: Order, index: number) => {
      const menuDisplay = order.orderItems.map((item) => (
        <div key={item.id} className="flex justify-between gap-2">
          <span>
            {item.menu.name} (x{item.quantity})
          </span>
          <span>Rp {item.menu.price.toLocaleString()}</span>
        </div>
      ));
      const totalPrice = order.orderItems.reduce(
        (sum, item) => sum + item.quantity * item.menu.price,
        0
      );
      return [
        currentLimit * (currentPage - 1) + index + 1,
        order.id, // pakai id langsung
        order.Customer.username,
        order.Table?.number ?? "-",
        <div key={`menu-names-${order.id}`} className="flex flex-col">
          {menuDisplay}
        </div>,
        totalPrice,
        <div
          key={order.id}
          className={cn("px-2 py-1 rounded-full text-white w-fit capitalize", {
            "bg-green-600": order.status === "settle",
            "bg-sky-600": order.status === "process",
            "bg-yellow-600": order.status === "pending",
            "bg-red-600": order.status === "canceled",
          })}
        >
          {order.status}
        </div>,
        <DropdownAction
          key={`dropdown-action-${order.id}`}
          menu={
            order.status === "pending"
              ? reservedActionList.map((item) => ({
                  label: item.label,
                  action: () =>
                    item.action(order.id, order.Table?.number.toString() ?? ""),
                }))
              : [
                  {
                    label: (
                      <Link
                        href={`/order/${order.id}`}
                        className="flex items-center gap-2"
                      >
                        <ScrollText />
                        Detail
                      </Link>
                    ),
                    type: "link",
                  },
                ]
          }
        />,
      ];
    });
  }, [orders, currentLimit, currentPage]);

  if (isLoading) return <p>Loading orders...</p>;
  if (isError) return <p>Error: {(error as Error).message}</p>;

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search..."
            value={currentSearch}
            onChange={(e) => handleChangeSearch(e.target.value)}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Create</Button>
            </DialogTrigger>
            {/* <DialogCreateOrder tables={tables} refetch={refetch} /> */}
          </Dialog>
        </div>
      </div>
      <DataTable
        header={HEADER_TABLE_ORDER}
        data={filteredData}
        isLoading={isLoading}
        totalPages={totalPages}
        currentPage={currentPage}
        currentLimit={currentLimit}
        onChangePage={handleChangePage}
        onChangeLimit={handleChangeLimit}
      />
    </div>
  );
};

export default OrderManagement;
