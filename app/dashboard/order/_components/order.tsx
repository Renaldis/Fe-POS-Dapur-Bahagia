"use client";

import DataTable from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { HEADER_TABLE_ORDER } from "@/constants/order-constant";
import { useQuery } from "@tanstack/react-query";
import { Ban, Link2Icon, ScrollText } from "lucide-react";
import React, { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import DropdownAction from "@/components/common/dropdown-action";
import Link from "next/link";
import { Order } from "@/types/orders";
import useDebounce from "@/hooks/use-debounce";

const OrderManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const debounce = useDebounce();

  // Debounced search state
  const [debouncedSearch, setDebouncedSearch] = useState("");
  React.useEffect(() => {
    debounce(() => setDebouncedSearch(searchInput), 300);
  }, [searchInput, debounce]);

  // Fetch semua order sekali
  const {
    data: orders,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders`
      );
      if (!res.ok) throw new Error("Gagal fetch data orders");
      return res.json();
    },
  });

  const filteredOrders = useMemo(() => {
    if (!orders?.data) return [];
    const searchLower = debouncedSearch.toLowerCase();
    return orders.data.filter(
      (order: Order) =>
        order.Customer.username.toLowerCase().includes(searchLower) ||
        order.Table?.number.toString().includes(searchLower) ||
        order.orderItems.some((item) =>
          item.menu.name.toLowerCase().includes(searchLower)
        )
    );
  }, [orders, debouncedSearch]);

  const totalPages = Math.ceil(filteredOrders.length / currentLimit);
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * currentLimit;
    const end = start + currentLimit;
    return filteredOrders.slice(start, end);
  }, [filteredOrders, currentPage, currentLimit]);

  const reservedActionList = [
    {
      label: (
        <span className="flex items-center gap-2">
          <Link2Icon />
          Process
        </span>
      ),
      action: (orderId: string, tableId: string) =>
        console.log("Process order", orderId, "on table", tableId),
    },
    {
      label: (
        <span className="flex items-center gap-2">
          <Ban className="text-red-500" />
          Cancel
        </span>
      ),
      action: (orderId: string, tableId: string) =>
        console.log("Cancel order", orderId, "on table", tableId),
    },
  ];

  // Prepare data untuk DataTable
  const tableData = useMemo(() => {
    return paginatedOrders.map((order: Order, index: number) => {
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
        (currentPage - 1) * currentLimit + index + 1,
        order.Customer.username,
        order.Table?.number ?? "-",
        <div key={`menu-${order.id}`} className="flex flex-col">
          {menuDisplay}
        </div>,
        <div key={`total-${order.id}`}>Rp {totalPrice.toLocaleString()}</div>,
        <div
          key={`status-${order.id}`}
          className={cn("px-2 py-1 rounded-full text-white w-fit capitalize", {
            "bg-green-600": order.status.toLowerCase() === "settle",
            "bg-sky-600": order.status.toLowerCase() === "process",
            "bg-yellow-600": order.status.toLowerCase() === "pending",
            "bg-red-600": order.status.toLowerCase() === "canceled",
          })}
        >
          {order.status}
        </div>,
        <DropdownAction
          key={`dropdown-${order.id}`}
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
  }, [paginatedOrders, currentPage, currentLimit]);

  if (isLoading) return <p>Loading orders...</p>;
  if (isError) return <p>Error: {(error as Error).message}</p>;

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Create</Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>
      <DataTable
        header={HEADER_TABLE_ORDER}
        data={tableData}
        isLoading={isLoading}
        totalPages={totalPages}
        currentPage={currentPage}
        currentLimit={currentLimit}
        onChangePage={setCurrentPage}
        onChangeLimit={setCurrentLimit}
      />
    </div>
  );
};

export default OrderManagement;
