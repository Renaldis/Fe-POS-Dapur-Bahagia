import {
  Album,
  Armchair,
  LayoutDashboard,
  SquareMenu,
  Users,
} from "lucide-react";

export const SIDEBAR_MENU_LIST = {
  admin: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Order",
      url: "/dashboard/order",
      icon: Album,
    },
    {
      title: "Menu",
      url: "/dashboard/menu",
      icon: SquareMenu,
    },
    {
      title: "Table",
      url: "/dashboard/table",
      icon: Armchair,
    },
    {
      title: "User",
      url: "/dashboard/user",
      icon: Users,
    },
  ],
  cashier: [],
  kitchen: [],
};

export type SidebarMenuKey = keyof typeof SIDEBAR_MENU_LIST; // untuk membuat key
