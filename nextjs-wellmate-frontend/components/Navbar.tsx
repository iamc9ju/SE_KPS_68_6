"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, User, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
    const { user } = useAuthStore();
    const { logoutUser } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isFoodPartner = user?.role === "food_partner";

    if (!mounted) {
        return <div className="h-[80px]" />; // Spacer for navbar height
    }

    return (
        <nav className="fixed top-0 w-full bg-white z-50 py-4 px-6 md:px-12 shadow-sm">
            <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="hover:opacity-90 transition-opacity flex items-center gap-2">
                    <img src="/logo.png" alt="WellMate Logo" className="h-20 w-auto" />
                </Link>

                {/* Menu */}
                <div className="hidden lg:flex items-center gap-8 font-medium text-[15px] text-gray-800">
                    <Link href="/" className="px-5 py-2.5 bg-gray-100 rounded-full font-semibold">
                        หน้าหลัก
                    </Link>
                    <Link href="/dashboard" className="hover:text-black transition-colors">
                        แดชบอร์ด
                    </Link>

                    {isFoodPartner ? (
                        <>
                            <Link href="/dashboard/menu" className="hover:text-black transition-colors">
                                จัดการเมนู
                            </Link>
                            <Link href="/dashboard/orders" className="hover:text-black transition-colors">
                                รายการสั่งซื้อ
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href="/dashboard/appointments" className="hover:text-black transition-colors">
                                ประวัติการนัดหมาย
                            </Link>
                            <button className="flex items-center gap-1.5 hover:text-black transition-colors">
                                บริการโภชนาการ
                                <ChevronDown className="w-4 h-4 text-gray-600" strokeWidth={2.5} />
                            </button>
                            <button className="flex items-center gap-1.5 hover:text-black transition-colors">
                                เมนูเพื่อสุขภาพ
                                <ChevronDown className="w-4 h-4 text-gray-600" strokeWidth={2.5} />
                            </button>
                            <Link href="/dashboard/progress" className="hover:text-black transition-colors">
                                ความคืบหน้า
                            </Link>
                        </>
                    )}
                </div>

                {/* Buttons / User Profile */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                            >
                                <div className="w-8 h-8 bg-[#C6E668] rounded-full flex items-center justify-center font-bold text-sm">
                                    {user.firstName?.charAt(0) || "U"}
                                </div>
                                <span className="text-sm font-semibold">{user.firstName}</span>
                            </Link>
                            <button
                                onClick={() => logoutUser()}
                                className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                title="ออกจากระบบ"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="px-6 py-2.5 text-black border border-black font-medium rounded-full hover:bg-gray-50 transition-colors"
                            >
                                เข้าสู่ระบบ
                            </Link>
                            <Link
                                href="/register"
                                className="px-6 py-2.5 text-black bg-[#C6E668] border border-gray-900 font-medium rounded-full hover:bg-[#b5d658] transition-colors"
                            >
                                สมัครสมาชิก
                            </Link>
                        </>
                    )}
                </div>

            </div>
        </nav>
    );
}
