// store/cartStore.ts
import { create } from "zustand";
import { Menu } from "@/validations/menu-validation"; // Import Menu type dari validasi Anda

interface CartItem extends Menu {
  quantity: number;
  note?: string;
}

interface CartState {
  items: CartItem[];
  totalPrice: number;
  addItem: (menu: Menu) => void;
  incrementQuantity: (id: string) => void;
  decrementQuantity: (id: string) => void;
  updateNote: (id: string, note: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  totalPrice: 0,
  addItem: (menu) =>
    set((state) => {
      const existingItem = state.items.find((item) => item.id === menu.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...menu, quantity: 1 });
      }
      const newTotalPrice = state.items.reduce(
        (acc, current) => acc + current.price * current.quantity,
        0
      );
      return { items: [...state.items], totalPrice: newTotalPrice };
    }),
  incrementQuantity: (id) =>
    set((state) => {
      const item = state.items.find((cartItem) => cartItem.id === id);
      if (item) item.quantity += 1;
      const newTotalPrice = state.items.reduce(
        (acc, current) => acc + current.price * current.quantity,
        0
      );
      return { items: [...state.items], totalPrice: newTotalPrice };
    }),
  decrementQuantity: (id) =>
    set((state) => {
      const item = state.items.find((cartItem) => cartItem.id === id);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else if (item && item.quantity === 1) {
        state.items = state.items.filter((cartItem) => cartItem.id !== id);
      }
      const newTotalPrice = state.items.reduce(
        (acc, current) => acc + current.price * current.quantity,
        0
      );
      return { items: [...state.items], totalPrice: newTotalPrice };
    }),
  updateNote: (id, note) =>
    set((state) => {
      const item = state.items.find((cartItem) => cartItem.id === id);
      if (item) item.note = note;
      return { items: [...state.items] };
    }),
  clearCart: () => set({ items: [], totalPrice: 0 }),
}));
