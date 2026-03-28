"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import api from "@/lib/api";

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  const { setUser, user } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initSession = async () => {
      try {
        // Only fetch if we don't have a user or to verify validity
        const res = await api.get("/auth/me");
        if (res.data.success || res.data.data) {
          setUser(res.data.data);
        }
      } catch (error) {
        console.error("Session restoration failed:", error);
        // If it fails (and silent refresh also fails), we clear the store
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    };

    initSession();
  }, [setUser]);


  return <>{children}</>;
}
