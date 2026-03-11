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
  profileImageUrl?: string;
  phone?: string;
  isProfileComplete?: boolean;
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
          await api.post("/auth/sign-out");
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          // Note: Cookies are cleared by the backend's /sign-out endpoint.
          // We just need to clear the local state.
          set({ user: null });
        }
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
