"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, CalendarDays, Heart, Calendar,
    MessageCircle, Utensils, Package, BookOpen,
    ClipboardList, BarChart3, Settings, LogOut
} from "lucide-react";

const menuItems = [
    { name: "แดชบอร์ด", href: "#", icon: LayoutDashboard },
    { name: "ประวัติการนัดหมาย", href: "#", icon: CalendarDays },
    { name: "บริการโภชนาการ", href: "#", icon: Heart },
    { name: "ปฏิทิน", href: "#", icon: Calendar },
    { name: "ข้อความ", href: "#", icon: MessageCircle },
    { name: "ร้านอาหารสุขภาพ", href: "#", icon: Utensils },
    { name: "รายการสั่งซื้อ", href: "#", icon: Package },
    { name: "แผนการกิน", href: "/mealplan", icon: BookOpen },
    { name: "บันทึกการกิน", href: "/fooddiary", icon: ClipboardList },
    { name: "ความคืบหน้า", href: "#", icon: BarChart3 },
    { name: "ตั้งค่า", href: "#", icon: Settings },
];

export default function FoodDiaryLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen bg-[#F5F1E8]">
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed top-0 left-0 h-screen z-30 shadow-sm">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#a3e635] rounded-2xl flex items-center justify-center">
                            <span className="text-[#1a2e05] font-black text-sm">W</span>
                        </div>
                        <div>
                            <p className="font-black text-[#4d7c0f] text-sm leading-tight">WELLMATE</p>
                            <p className="text-[10px] text-gray-400 font-medium">สุขภาพดีเริ่มที่นี่</p>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link key={item.name} href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${isActive ? "bg-[#a3e635] text-[#1a2e05] font-bold shadow-sm" : "text-gray-500 hover:bg-green-50 hover:text-[#4d7c0f]"}`}>
                                <Icon className={`w-5 h-5 ${isActive ? "text-[#1a2e05]" : "text-gray-400"}`} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-gray-100">
                    <button className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors w-full">
                        <LogOut className="w-5 h-5" />
                        <span>ออกจากระบบ</span>
                    </button>
                </div>
            </aside>
            <main className="flex-1 ml-64 min-h-screen">{children}</main>
        </div>
    );
}
