"use client";

import DataTable from "@/components/common/data-table";
import DropdownAction from "@/components/common/dropdown-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { HEADER_TABLE_MENU } from "@/constants/menu-constant";
import useDebounce from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { Menu } from "@/types/menu";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import React, { useMemo, useState } from "react";
import DialogUpdateMenu from "./dialog-update-menu";
import { MenuApi } from "@/consts/api";
import DialogDeleteMenu from "./dialog-delete-menu";

const MenuManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const debounce = useDebounce();

  const [debouncedSearch, setDebouncedSearch] = useState("");
  React.useEffect(() => {
    debounce(() => setDebouncedSearch(searchInput), 300);
  }, [searchInput, debounce]);

  // Fetch semua order sekali
  const {
    data: menus,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await fetch(MenuApi.GetAll);
      if (!res.ok) throw new Error("Gagal fetch data menus");
      return res.json();
    },
  });

  const [selectedAction, setSelectedAction] = useState<{
    data: Menu;
    type: "update" | "delete";
  } | null>(null);

  const handleChangeAction = (open: boolean) => {
    if (!open) setSelectedAction(null);
  };

  const filteredMenus = useMemo(() => {
    if (!menus) return [];
    const searchLower = debouncedSearch.toLowerCase();
    return menus.filter((menu: Menu) =>
      menu.name.toLowerCase().includes(searchLower)
    );
  }, [menus, debouncedSearch]);

  const totalPages = Math.ceil(filteredMenus.length / currentLimit);
  const paginatedMenus = useMemo(() => {
    const start = (currentPage - 1) * currentLimit;
    const end = start + currentLimit;
    return filteredMenus.slice(start, end);
  }, [filteredMenus, currentPage, currentLimit]);

  const filteredData = useMemo(() => {
    return (paginatedMenus || []).map((menu: Menu, index: number) => {
      return [
        currentLimit * (currentPage - 1) + index + 1,
        <div className="flex items-center gap-2" key={`menu-name-${menu.id}`}>
          {menu.name}
        </div>,
        menu.description,
        menu.category,
        <div key={`menu-card-${menu.id}`}>
          <p>Rp.{menu.price}</p>
        </div>,
        <div
          key={`stock-${menu.id}`}
          className={cn(
            "px-2 py-1 rounded-full text-white w-fit",
            menu.stock > 10 ? "text-green-600" : "text-red-500"
          )}
        >
          {menu.stock}
        </div>,
        <DropdownAction
          key={`dropdown-${menu.id}`}
          menu={[
            {
              label: (
                <span className="flex item-center gap-2">
                  <Pencil />
                  Edit
                </span>
              ),
              action: () => {
                setSelectedAction({
                  data: menu,
                  type: "update",
                });
              },
            },
            {
              label: (
                <span className="flex item-center gap-2">
                  <Trash2 className="text-red-400" />
                  Delete
                </span>
              ),
              variant: "destructive",
              action: () => {
                setSelectedAction({
                  data: menu,
                  type: "delete",
                });
              },
            },
          ]}
        />,
      ];
    });
  }, [currentLimit, currentPage, paginatedMenus]);

  if (isLoading) return <p>Loading orders...</p>;
  if (isError) return <p>Error: {(error as Error).message}</p>;

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-2xl font-bold">Menu Management</h1>
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
        header={HEADER_TABLE_MENU}
        data={filteredData}
        isLoading={isLoading}
        totalPages={totalPages}
        currentPage={currentPage}
        currentLimit={currentLimit}
        onChangePage={setCurrentPage}
        onChangeLimit={setCurrentLimit}
      />
      <DialogUpdateMenu
        open={selectedAction !== null && selectedAction.type === "update"}
        refetch={refetch}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      />
      <DialogDeleteMenu
        open={selectedAction !== null && selectedAction.type === "delete"}
        refetch={refetch}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      />
    </div>
  );
};

export default MenuManagement;
