"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import { Suspense } from "react";

const loginSchema = z.object({
  email: z.string().min(1, "กรุณากรอกอีเมล").email("รูปแบบอีเมลไม่ถูกต้อง"),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#3d3522]" /></div>}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { loginUser, isLoading, error } = useAuth();
  const searchParams = useSearchParams();
  const sessionExpired = searchParams.get("session_expired");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("savedEmail");
    }
    return false;
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setValue("email", savedEmail);
    }

    if (sessionExpired === "true") {
      Swal.fire({
        html: `
          <div style="padding: 8px 4px;">
            <div style="width:64px;height:64px;background:linear-gradient(135deg,#fef3c7,#fde68a);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:28px;box-shadow:0 4px 20px rgba(251,191,36,0.25);">
              ⏱️
            </div>
            <h2 style="font-size:22px;font-weight:900;color:#3d3522;margin:0 0 8px;letter-spacing:-0.3px;">
              Session หมดอายุแล้ว
            </h2>
            <p style="font-size:14px;color:#8a7550;margin:0;line-height:1.6;">
              เซสชันของคุณหมดอายุเนื่องจากไม่มีการใช้งาน<br/>กรุณาเข้าสู่ระบบใหม่อีกครั้งเพื่อดำเนินการต่อ
            </p>
          </div>
        `,
        showConfirmButton: true,
        confirmButtonText: "เข้าสู่ระบบใหม่",
        customClass: {
          popup: "swal-wellmate-popup",
          confirmButton: "swal-wellmate-btn",
        },
        buttonsStyling: false,
        backdrop: "rgba(61,53,34,0.3)",
        showClass: {
          popup: "swal2-show",
        },
        hideClass: {
          popup: "swal2-hide",
        },
      });
      // URL cleanup
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [setValue, sessionExpired]);

  const onSubmit = async (data: LoginFormInputs) => {
    await loginUser(data, rememberMe);
  };

  return (
    <>
      <div className="mb-10">
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <img src="/logo.png" alt="WellMate Logo" className="h-32 w-auto" />
          </div>
        </div>
        <h2 className="text-4xl font-black text-[#3d3522] leading-tight mb-2">เข้าสู่ระบบ</h2>
        <p className="text-[#8a7550]">ยินดีต้อนรับกลับสู่ WellMate</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm mb-6 border border-red-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="bg-red-100 p-1.5 rounded-full">
            <AlertCircle className="w-4 h-4" />
          </div>
          <span className="font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" autoComplete="off">
        <div>
          <label className="text-xs font-bold text-[#8a7550] uppercase tracking-[0.15em] mb-2 block">อีเมล</label>
          <div className="relative">
            <Mail className="absolute left-4 top-[14px] w-5 h-5 text-[#c9b88a]" />
            <input
              {...register("email")}
              className="w-full pl-12 pr-4 py-[13px] bg-white rounded-2xl border-2 border-[#f0e6cc] focus:border-[#C6E065] focus:shadow-[0_0_0_3px_rgba(198,224,101,0.15)] outline-none transition-all text-[#3d3522] font-medium placeholder-[#c9b88a] shadow-[0_2px_8px_rgba(180,160,110,0.08)]"
              placeholder="you@example.com"
            />
          </div>
          {errors.email && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="text-xs font-bold text-[#8a7550] uppercase tracking-[0.15em] mb-2 block">รหัสผ่าน</label>
          <div className="relative">
            <Lock className="absolute left-4 top-[14px] w-5 h-5 text-[#c9b88a]" />
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              className="w-full pl-12 pr-12 py-[13px] bg-white rounded-2xl border-2 border-[#f0e6cc] focus:border-[#C6E065] focus:shadow-[0_0_0_3px_rgba(198,224,101,0.15)] outline-none transition-all text-[#3d3522] font-medium placeholder-[#c9b88a] shadow-[0_2px_8px_rgba(180,160,110,0.08)]"
              placeholder="••••••••"
            />
            <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-4 top-[14px] text-[#c9b88a] hover:text-[#4A6707] transition-colors">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.password.message}</p>}
        </div>

        <div className="flex justify-between items-center pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="accent-[#4A6707] w-4 h-4 rounded"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span className="text-sm text-[#8a7550]">จดจำฉัน</span>
          </label>
          <a href="#" className="text-sm text-[#4A6707] font-semibold hover:underline">ลืมรหัสผ่าน?</a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-[#3d3522] text-white font-bold rounded-2xl text-base hover:bg-[#2c2518] active:scale-[0.97] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 mt-2 disabled:opacity-80 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>กำลังเข้าสู่ระบบ...</span>
            </>
          ) : (
            "เข้าสู่ระบบ"
          )}
        </button>
      </form>

      <div className="flex items-center gap-4 mt-8">
        <div className="flex-1 h-px bg-[#e8d5a8]/40"></div>
        <span className="text-xs text-[#c9b88a] font-medium">หรือ</span>
        <div className="flex-1 h-px bg-[#e8d5a8]/40"></div>
      </div>

      <p className="mt-6 text-center text-[#8a7550] text-sm">
        ยังไม่มีบัญชี?{" "}
        <Link href="/register" className="text-[#4A6707] font-bold hover:underline">
          สมัครสมาชิก
        </Link>
      </p>
    </>
  );
}


