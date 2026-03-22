"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/api";

interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "patient" | "nutritionist" | "food_partner" | "admin";
  phone?: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (user: User | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      login: (user) => set({ user }),
      logout: async () => {
        try {
          await api.post("/auth/logout");
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          set({ user: null });
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
