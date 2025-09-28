export interface Menu {
  name: string;
  price: number;
  description: string;
}

export interface OrderItem {
  id: string;
  quantity: number;
  notes: string;
  menuId: string;
  menu: Menu;
}

export interface Customer {
  username: string;
  phone: string;
}

export interface Table {
  number: number;
  capacity: number;
}

export interface Order {
  id: string;
  status: "pending" | "process" | "settle" | "canceled";
  createdAt: string;
  updatedAt: string;
  customerId: string;
  tableId: string;
  Customer: Customer;
  Table: Table;
  orderItems: OrderItem[];
}
