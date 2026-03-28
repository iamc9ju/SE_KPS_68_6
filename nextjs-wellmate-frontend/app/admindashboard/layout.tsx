"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Store,
    UserCheck,
    ShoppingBag,
    CalendarCheck,
    Banknote,
    RefreshCcw,
    BarChart2,
    LogOut,
} from "lucide-react";

const menuItems = [
    { label: "Dashboard", href: "/admindashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "จัดการผู้ใช้", href: "/admindashboard/users", icon: <Users className="w-5 h-5" /> },
    { label: "จัดการร้านค้าพาร์ทเนอร์", href: "/admindashboard/partners", icon: <Store className="w-5 h-5" /> },
    { label: "อนุมัติโปรไฟล์นักโภชนาการ", href: "/admindashboard/nutritionists", icon: <UserCheck className="w-5 h-5" /> },
    { label: "ติดตามออเดอร์", href: "/admindashboard/orders", icon: <ShoppingBag className="w-5 h-5" /> },
    { label: "ติดตามการจอง", href: "/admindashboard/bookings", icon: <CalendarCheck className="w-5 h-5" /> },
    { label: "จ่ายเงินให้ร้านค้า", href: "/admindashboard/payments", icon: <Banknote className="w-5 h-5" /> },
    { label: "จัดการการคืนเงิน", href: "/admindashboard/refunds", icon: <RefreshCcw className="w-5 h-5" /> },
    { label: "ข้อมูลเชิงวิเคราะห์", href: "/admindashboard/analytics", icon: <BarChart2 className="w-5 h-5" /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen bg-[#F5F1E8]">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed top-0 left-0 h-screen z-30 shadow-sm">
                {/* Logo */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#ffd980] rounded-2xl flex items-center justify-center">
                            <span className="text-[#7a5c00] font-black text-sm">W</span>
                        </div>
                        <div>
                            <p className="font-black text-gray-900 text-sm leading-tight">WELLMATE</p>
                            <p className="text-[10px] text-gray-400 font-medium">ผู้ดูแลระบบ</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                                    isActive
                                        ? "bg-[#ffd980] text-[#7a5c00] font-bold shadow-sm"
                                        : "text-gray-500 hover:bg-[#fff8e1] hover:text-[#7a5c00]"
                                }`}
                            >
                                <span className={isActive ? "text-[#7a5c00]" : "text-gray-400"}>
                                    {item.icon}
                                </span>
                                <span className="leading-tight">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div className="p-4 border-t border-gray-100">
                    <button className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors w-full">
                        <LogOut className="w-5 h-5" />
                        <span>ออกจากระบบ</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 min-h-screen">
                {children}
            </main>
        </div>
    );
}
