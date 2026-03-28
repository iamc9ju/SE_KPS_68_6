import { useState } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import axios from "axios";

export interface AuthUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "patient" | "nutritionist" | "food_partner" | "admin";
  phone?: string;
  isProfileComplete?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

interface ApiErrorResponse {
  message: string;
  error?: string;
  statusCode?: number;
}

interface RegisterResponse {
  message: string;
  data: AuthUser;
}

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();
  const routeByRole = (role: AuthUser["role"] | undefined) => {
    if (role === "food_partner") return "/Foodpartner/profile";
    if (role === "patient") return "/healthdata";
    return "/dashboard";
  };

  const handleAxiosError = (err: unknown, defaultMessage: string) => {
    let message = defaultMessage;
    if (axios.isAxiosError<ApiErrorResponse>(err)) {
      message = err.response?.data?.message || err.message || message;
    } else if (err instanceof Error) {
      message = err.message;
    }
    setError(message);
    return message;
  };

  const loginUser = async (
    data: Record<string, string>,
    rememberMe: boolean,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.post<ApiResponse<AuthUser>>("/auth/login", {
        email: data.email,
        password: data.password,
      });

      if (res.data != null) {
        await Swal.fire({
          icon: "success",
          title: "เข้าสู่ระบบสำเร็จ!",
          text: "ยินดีต้อนรับเข้าสู่ระบบ",
          timer: 1500,
          showConfirmButton: false,
          color: "#3d3522",
          confirmButtonColor: "#C6E065",
        });
      }

      login(res.data.data);

      if (rememberMe) {
        localStorage.setItem("savedEmail", data.email);
      } else {
        localStorage.removeItem("savedEmail");
      }

      router.push(routeByRole(res.data.data?.role));
    } catch (err) {
      const message = handleAxiosError(
        err,
        "เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
      );
      await Swal.fire({
        icon: "error",
        title: "เข้าสู่ระบบไม่สำเร็จ",
        text: message,
        confirmButtonText: "ลองใหม่",
        color: "#3d3522",
        confirmButtonColor: "#3d3522",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (
    payload: Omit<Record<string, string>, "confirmPassword">,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.post<RegisterResponse>("/auth/register", payload);
      await Swal.fire({
        icon: "success",
        title: "สมัครสมาชิกสำเร็จ!",
        text: "กำลังพาคุณเข้าสู่ระบบ...",
        timer: 1500,
        showConfirmButton: false,
        color: "#3d3522",
        confirmButtonColor: "#C6E065",
      });

      // Auto-login
      if (res.data?.data) {
        login(res.data.data);
        router.push(routeByRole(res.data.data?.role));
      } else {
        router.push("/login?registered=true");
      }
    } catch (err) {
      handleAxiosError(err, "สมัครสมาชิกไม่สำเร็จ");
    } finally {
      setIsLoading(false);
    }
  };

  const logoutUser = async () => {
    const result = await Swal.fire({
      title: "ออกจากระบบ?",
      text: "คุณต้องการออกจากระบบใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3d3522",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "ใช่, ออกจากระบบ",
      cancelButtonText: "ยกเลิก",
      color: "#3d3522",
      background: "#fffbf5",
      customClass: {
        popup: "rounded-3xl",
        confirmButton: "rounded-2xl px-6 py-2.5 font-bold shadow-md",
        cancelButton: "rounded-2xl px-6 py-2.5 font-bold shadow-md",
        title: "text-2xl font-black mt-4",
      },
    });

    if (result.isConfirmed) {
      setIsLoading(true);

      Swal.fire({
        title: "กำลังออกจากระบบ...",
        text: "กรุณารอสักครู่",
        allowOutsideClick: false,
        showConfirmButton: false,
        background: "#fffbf5",
        color: "#3d3522",
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        // Call API directly to control state clearing timing
        await api.post("/auth/sign-out");

        // Wait a tiny bit for UX
        await new Promise((resolve) => setTimeout(resolve, 500));

        await Swal.fire({
          icon: "success",
          title: "ออกจากระบบสำเร็จ",
          timer: 1000,
          showConfirmButton: false,
          background: "#fffbf5",
          color: "#3d3522",
        });

        // Navigate first
        router.replace("/login");

        // Clear user state AFTER navigation has started to prevent UI flicker
        setTimeout(() => {
          useAuthStore.getState().setUser(null);
        }, 100);
      } catch (err) {
        handleAxiosError(err, "ออกจากระบบไม่สำเร็จ");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return { loginUser, registerUser, logoutUser, isLoading, error, setError };
};
