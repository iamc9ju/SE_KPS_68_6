"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  Stethoscope,
  Phone,
  Loader2,
  Utensils,
  Store,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface RegisterForm {
  firstName: string;
  lastName: string;
  role: "patient" | "nutritionist" | "food_partner" | "admin";
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  partnerName?: string;
}

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    defaultValues: {
      role: "patient",
      phone: "",
    },
  });

  const selectedRole = watch("role");
  const password = watch("password");
  const { registerUser, isLoading, error: authError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data: RegisterForm) => {
    const { confirmPassword: _confirmPassword, ...payload } = data;

    // For food_partner, map partnerName to firstName and partnerName
    if (payload.role === "food_partner") {
      payload.firstName = payload.partnerName || "ร้านอาหารของฉัน";
      payload.lastName = " "; // Backend might require a non-empty string
      payload.partnerName = payload.firstName;
    }

    await registerUser(payload);
  };

  return (
    <>
      <div className="mb-6">
        <div className="mb-5">
          <div className="flex items-center justify-center">
            <img src="/logo.png" alt="WellMate Logo" className="h-28 w-auto" />
          </div>
        </div>
        <h2 className="text-4xl font-black text-[#3d3522] leading-tight mb-2">สมัครสมาชิก</h2>
        <p className="text-[#8a7550]">สร้างบัญชีเพื่อเริ่มต้นดูแลสุขภาพกับเรา</p>
      </div>

      {authError && (
        <div className="bg-red-50 text-red-500 px-4 py-3 rounded-2xl text-sm mb-4 border border-red-100 flex items-center gap-2">
          <span>??</span>
          <span>{authError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        <AnimatePresence mode="wait">
          {selectedRole === "food_partner" ? (
            <motion.div
              key="store-field"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <label className="text-xs font-bold text-[#8a7550] uppercase tracking-[0.15em] mb-1.5 block">ชื่อร้านอาหาร</label>
              <div className="relative">
                <Store className="absolute left-4 top-[14px] w-5 h-5 text-[#c9b88a]" />
                <input
                  {...register("partnerName", { required: selectedRole === "food_partner" ? "กรุณากรอกชื่อร้าน" : false })}
                  className="w-full pl-12 pr-4 py-[13px] bg-white rounded-2xl border-2 border-[#f0e6cc] focus:border-[#C6E065] focus:shadow-[0_0_0_3px_rgba(198,224,101,0.15)] outline-none transition-all text-[#3d3522] font-medium"
                  placeholder="ชื่อร้านอาหารของคุณ"
                />
              </div>
              {errors.partnerName && <p className="text-red-400 text-xs mt-1 ml-1">{errors.partnerName.message}</p>}
            </motion.div>
          ) : (
            <motion.div
              key="personal-fields"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 gap-3"
            >
              <div>
                <label className="text-xs font-bold text-[#8a7550] uppercase tracking-[0.15em] mb-1.5 block">ชื่อ</label>
                <div className="relative">
                  <User className="absolute left-4 top-[14px] w-5 h-5 text-[#c9b88a]" />
                  <input
                    {...register("firstName", { required: (selectedRole as string) !== "food_partner" ? "กรุณากรอกชื่อ" : false })}
                    className="w-full pl-12 pr-4 py-[13px] bg-white rounded-2xl border-2 border-[#f0e6cc] focus:border-[#C6E065] focus:shadow-[0_0_0_3px_rgba(198,224,101,0.15)] outline-none transition-all text-[#3d3522] font-medium"
                    placeholder="ชื่อ"
                  />
                </div>
                {errors.firstName && <p className="text-red-400 text-xs mt-1 ml-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="text-xs font-bold text-[#8a7550] uppercase tracking-[0.15em] mb-1.5 block">นามสกุล</label>
                <input
                  {...register("lastName", { required: (selectedRole as string) !== "food_partner" ? "กรุณากรอกนามสกุล" : false })}
                  className="w-full px-4 py-[13px] bg-white rounded-2xl border-2 border-[#f0e6cc] focus:border-[#C6E065] focus:shadow-[0_0_0_3px_rgba(198,224,101,0.15)] outline-none transition-all text-[#3d3522] font-medium"
                  placeholder="นามสกุล"
                />
                {errors.lastName && <p className="text-red-400 text-xs mt-1 ml-1">{errors.lastName.message}</p>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div>
          <label className="text-xs font-bold text-[#8a7550] uppercase tracking-[0.15em] mb-1.5 block">อีเมล</label>
          <div className="relative">
            <Mail className="absolute left-4 top-[14px] w-5 h-5 text-[#c9b88a]" />
            <input
              {...register("email", {
                required: "กรุณากรอกอีเมล",
                pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "รูปแบบอีเมลไม่ถูกต้อง" },
              })}
              className="w-full pl-12 pr-4 py-[13px] bg-white rounded-2xl border-2 border-[#f0e6cc] focus:border-[#C6E065] focus:shadow-[0_0_0_3px_rgba(198,224,101,0.15)] outline-none transition-all text-[#3d3522] font-medium"
              placeholder="you@example.com"
            />
          </div>
          {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="text-xs font-bold text-[#8a7550] uppercase tracking-[0.15em] mb-1.5 block">เบอร์โทรศัพท์</label>
          <div className="relative">
            <Phone className="absolute left-4 top-[14px] w-5 h-5 text-[#c9b88a]" />
            <input
              {...register("phone", {
                required: "กรุณากรอกเบอร์โทรศัพท์",
                pattern: { value: /^[0-9]{10}$/, message: "กรุณากรอกเบอร์โทรศัพท์ 10 หลัก" },
              })}
              className="w-full pl-12 pr-4 py-[13px] bg-white rounded-2xl border-2 border-[#f0e6cc] focus:border-[#C6E065] focus:shadow-[0_0_0_3px_rgba(198,224,101,0.15)] outline-none transition-all text-[#3d3522] font-medium"
              placeholder="08XXXXXXXX"
            />
          </div>
          {errors.phone && <p className="text-red-400 text-xs mt-1 ml-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="text-xs font-bold text-[#8a7550] uppercase tracking-[0.15em] mb-1.5 block">รหัสผ่าน</label>
          <div className="relative">
            <Lock className="absolute left-4 top-[14px] w-5 h-5 text-[#c9b88a]" />
            <input
              {...register("password", { required: "กรุณากรอกรหัสผ่าน", minLength: { value: 8, message: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" } })}
              type={showPassword ? "text" : "password"}
              className="w-full pl-12 pr-12 py-[13px] bg-white rounded-2xl border-2 border-[#f0e6cc] focus:border-[#C6E065] focus:shadow-[0_0_0_3px_rgba(198,224,101,0.15)] outline-none transition-all text-[#3d3522] font-medium"
              placeholder="อย่างน้อย 8 ตัวอักษร"
            />
            <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-4 top-[14px] text-[#c9b88a] hover:text-[#4A6707]">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <p className="text-red-400 text-xs mt-1 ml-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="text-xs font-bold text-[#8a7550] uppercase tracking-[0.15em] mb-1.5 block">ยืนยันรหัสผ่าน</label>
          <div className="relative">
            <Lock className="absolute left-4 top-[14px] w-5 h-5 text-[#c9b88a]" />
            <input
              {...register("confirmPassword", { required: "กรุณายืนยันรหัสผ่าน", validate: (value) => value === password || "รหัสผ่านไม่ตรงกัน" })}
              type={showConfirmPassword ? "text" : "password"}
              className="w-full pl-12 pr-12 py-[13px] bg-white rounded-2xl border-2 border-[#f0e6cc] focus:border-[#C6E065] focus:shadow-[0_0_0_3px_rgba(198,224,101,0.15)] outline-none transition-all text-[#3d3522] font-medium"
              placeholder="ยืนยันรหัสผ่านอีกครั้ง"
            />
            <button type="button" onClick={() => setShowConfirmPassword((v) => !v)} className="absolute right-4 top-[14px] text-[#c9b88a] hover:text-[#4A6707]">
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-400 text-xs mt-1 ml-1">{errors.confirmPassword.message}</p>}
        </div>

        <div>
          <label className="text-xs font-bold text-[#8a7550] uppercase tracking-[0.15em] mb-3 block">ประเภทบัญชี</label>
          <div className="grid grid-cols-3 gap-3">
            <label className={`relative cursor-pointer rounded-2xl border-2 p-4 flex flex-col items-center gap-3 transition-all ${selectedRole === "patient" ? "bg-[#fcfeda] border-[#C6E065] shadow-sm" : "bg-white border-[#f0e6cc] hover:border-[#e8d5a8]"}`}>
              <input type="radio" value="patient" {...register("role")} className="hidden" />
              <div className={`p-2.5 rounded-full transition-colors ${selectedRole === "patient" ? "bg-[#C6E065] text-[#3d3522]" : "bg-[#f4ebd0] text-[#8a7550]"}`}><User className="w-5 h-5 md:w-6 md:h-6" /></div>
              <span className={`font-bold text-[10px] md:text-xs text-center ${selectedRole === "patient" ? "text-[#3d3522]" : "text-[#8a7550]"}`}>ผู้ป่วย</span>
              {selectedRole === "patient" && <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-[#4A6707]" />}
            </label>
            <label className={`relative cursor-pointer rounded-2xl border-2 p-4 flex flex-col items-center gap-3 transition-all ${selectedRole === "nutritionist" ? "bg-[#fcfeda] border-[#C6E065] shadow-sm" : "bg-white border-[#f0e6cc] hover:border-[#e8d5a8]"}`}>
              <input type="radio" value="nutritionist" {...register("role")} className="hidden" />
              <div className={`p-2.5 rounded-full transition-colors ${selectedRole === "nutritionist" ? "bg-[#C6E065] text-[#3d3522]" : "bg-[#f4ebd0] text-[#8a7550]"}`}><Stethoscope className="w-5 h-5 md:w-6 md:h-6" /></div>
              <span className={`font-bold text-[10px] md:text-xs text-center ${selectedRole === "nutritionist" ? "text-[#3d3522]" : "text-[#8a7550]"}`}>นักโภชนาการ</span>
              {selectedRole === "nutritionist" && <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-[#4A6707]" />}
            </label>
            <label className={`relative cursor-pointer rounded-2xl border-2 p-4 flex flex-col items-center gap-3 transition-all ${selectedRole === "food_partner" ? "bg-[#fcfeda] border-[#C6E065] shadow-sm" : "bg-white border-[#f0e6cc] hover:border-[#e8d5a8]"}`}>
              <input type="radio" value="food_partner" {...register("role")} className="hidden" />
              <div className={`p-2.5 rounded-full transition-colors ${selectedRole === "food_partner" ? "bg-[#C6E065] text-[#3d3522]" : "bg-[#f4ebd0] text-[#8a7550]"}`}><Utensils className="w-5 h-5 md:w-6 md:h-6" /></div>
              <span className={`font-bold text-[10px] md:text-xs text-center ${selectedRole === "food_partner" ? "text-[#3d3522]" : "text-[#8a7550]"}`}>ร้านอาหาร</span>
              {selectedRole === "food_partner" && <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-[#4A6707]" />}
            </label>
          </div>
        </div>


        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-[#3d3522] text-white font-bold rounded-2xl text-base hover:bg-[#2c2518] active:scale-[0.97] transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-80 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>กำลังสมัครสมาชิก...</span>
            </>
          ) : (
            "สมัครสมาชิก"
          )}
        </button>
      </form>

      <p className="mt-4 text-center text-[#8a7550] text-sm">
        มีบัญชีอยู่แล้ว?{" "}
        <Link href="/login" className="text-[#4A6707] font-bold hover:underline">
          เข้าสู่ระบบ
        </Link>
      </p>
    </>
  );
}


