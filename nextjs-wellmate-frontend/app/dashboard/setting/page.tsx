"use client";

import React from "react";
import ImageUpload from "@/components/common/ImageUpload";
import { useAuthStore } from "@/store/auth-store";
import { Mail, User, Shield } from "lucide-react";

export default function SettingPage() {
    const { user } = useAuthStore();

    const roleLabels: Record<string, string> = {
        patient: "คนไข้",
        nutritionist: "นักโภชนาการ",
        food_partner: "พาร์ทเนอร์อาหาร",
        admin: "ผู้ดูแลระบบ",
    };

    return (
        <main className="flex-1 overflow-y-auto px-8 py-10 z-10 custom-scrollbar ml-64">
            <header className="mb-10 animate-fadeIn">
                <h1 className="text-4xl font-black mb-2 text-[#3d3522]">ตั้งค่า</h1>
                <p className="text-[#8a7550] font-medium text-lg">จัดการข้อมูลส่วนตัวและการแจ้งเตือนของคุณ</p>
            </header>

            {/* Profile Section */}
            <div className="bg-white p-8 rounded-[40px] shadow-[0_2px_40px_rgba(0,0,0,0.02)] border border-[#f0e6cc] animate-slideUp">
                <h2 className="text-xl font-bold text-[#3d3522] mb-6">รูปโปรไฟล์</h2>

                <div className="flex items-center gap-8">
                    {/* Upload Component */}
                    <ImageUpload sizeClasses="w-[120px] h-[120px]" />

                    {/* User Info */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-[#3d3522]">
                            <User className="w-5 h-5 text-[#FF6A2C]" />
                            <span className="font-bold text-lg">
                                {user?.firstName || "ไม่ระบุ"} {user?.lastName || ""}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-[#8a7550]">
                            <Mail className="w-5 h-5 text-[#FF6A2C]" />
                            <span className="font-medium">{user?.email || "-"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#8a7550]">
                            <Shield className="w-5 h-5 text-[#FF6A2C]" />
                            <span className="font-medium">{roleLabels[user?.role || ""] || user?.role}</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">
                            คลิกที่ไอคอนกล้องบนรูปโปรไฟล์เพื่ออัปโหลดรูปภาพใหม่
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
