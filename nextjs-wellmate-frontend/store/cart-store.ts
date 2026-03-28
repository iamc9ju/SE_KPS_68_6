"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface MenuItem {
  menuItemId: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category?: string;
  caloriesKcal?: number;
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
  foodPartnerId?: number;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  addItem: (item: MenuItem, quantity: number) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      setIsOpen: (isOpen) => set({ isOpen }),
      addItem: (item, quantity) => {
        const items = get().items;
        const existingItem = items.find(
          (i) => i.menuItemId === item.menuItemId,
        );

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.menuItemId === item.menuItemId
                ? { ...i, quantity: i.quantity + quantity }
                : i,
            ),
          });
        } else {
          set({ items: [...items, { ...item, quantity }] });
        }
      },
      removeItem: (menuItemId) => {
        set({
          items: get().items.filter((i) => i.menuItemId !== menuItemId),
        });
      },
      updateQuantity: (menuItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(menuItemId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.menuItemId === menuItemId ? { ...i, quantity } : i,
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },
    }),
    {
      name: "cart-storage",
    },
  ),
);
