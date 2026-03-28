"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutGrid,
    Heart,
    Calendar,
    MessageSquare,
    Utensils,
    BookOpen,
    ScrollText,
    BarChart2,
    LogOut,
    UserCog,
    Clock,
    Package,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useAuth } from "@/hooks/useAuth";

type UserRole = "patient" | "nutritionist" | "food_partner" | "admin";

export default function Sidebar() {
    const pathname = usePathname();
    const { logoutUser } = useAuth();
    const user = useAuthStore((state) => state.user);

    const menuItems = [
        { icon: LayoutGrid, label: "แดชบอร์ด", href: "/dashboard" },
        { icon: Calendar, label: "ประวัติการนัดหมาย", href: "/dashboard/appointments", roles: ["patient", "admin"] },
        { icon: Heart, label: "บริการโภชนาการ", href: "/dashboard/nutrition", roles: ["patient", "admin"] },
        { icon: Calendar, label: "ปฏิทิน", href: "/dashboard/calendar", roles: ["patient", "nutritionist", "admin"] },
        { icon: Clock, label: "จัดการเวลาทำงาน", href: "/dashboard/nutritionists/schedule", roles: ["nutritionist", "admin"] },
        { icon: MessageSquare, label: "ข้อความ", href: "/dashboard/chat", roles: ["patient", "nutritionist", "admin"] },
        { icon: Utensils, label: "ร้านอาหารสุขภาพ", href: "/dashboard/healthymenu", roles: ["patient", "admin"] },
        { icon: Utensils, label: "จัดการเมนู", href: "/dashboard/menu", roles: ["food_partner", "admin"] },
        { icon: Package, label: "รายการสั่งซื้อ", href: "/dashboard/orders", roles: ["patient", "food_partner", "admin"] },
        { icon: BookOpen, label: "แผนการกิน", href: "/dashboard/meal-plan", roles: ["patient", "nutritionist", "admin"] },
        { icon: ScrollText, label: "บันทึกอาหาร", href: "/dashboard/food-diary", roles: ["patient"] },
        { icon: BarChart2, label: "ความคืบหน้า", href: "/dashboard/progress", roles: ["patient", "admin"] },
        { icon: UserCog, label: "ตั้งค่า", href: "/dashboard/setting" },
    ];

    const userRole = useAuthStore((state) => state.user?.role);
    const isFoodPartner = userRole === "food_partner";

    // Define specific items for food partner to maintain their previous navigation structure
    const filteredMenuItems = isFoodPartner
        ? [
            { icon: LayoutGrid, label: "แดชบอร์ด", href: "/dashboard" },
            { icon: Utensils, label: "จัดการเมนู", href: "/dashboard/menu" },
            { icon: Package, label: "รายการสั่งซื้อ", href: "/dashboard/orders" },
            { icon: BookOpen, label: "ประวัติ", href: "/dashboard/history" },
            { icon: UserCog, label: "ตั้งค่า", href: "/dashboard/profile" },
        ]
        : menuItems.filter((item) => {
            if (!item.roles) return true;
            if (!userRole) return false;
            return item.roles.includes(userRole as UserRole);
        });

    const userInitial =
        user?.firstName?.charAt(0) ||
        user?.lastName?.charAt(0) ||
        user?.email?.charAt(0) ||
        "U";

    return (
        <aside
            className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-100 flex flex-col z-20 p-6 shadow-sm"
        >
            <Link
                href="/"
                className="flex items-center justify-center px-2 group mb-10"
            >
                <img
                    src="/logo.png"
                    alt="WellMate Logo"
                    className="h-20 w-auto group-hover:scale-110 transition-transform"
                />
            </Link>

            <nav
                className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2"
            >
                {filteredMenuItems.map((item) => {
                    const isRoot = item.href === "/dashboard";
                    const isActive = isRoot ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                        <Link
                            key={`${item.href}-${item.label}`}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${isActive
                                ? "bg-[#C6E065] text-[#3d3522] font-bold shadow-md"
                                : "text-gray-500 hover:bg-gray-50 hover:text-[#3d3522]"
                                }`}
                        >
                            <item.icon
                                className={`w-5 h-5 ${isActive ? "text-[#3d3522]" : "text-gray-400"}`}
                            />
                            <span className="text-sm">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col gap-4">


                <button
                    onClick={logoutUser}
                    className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">
                        ออกจากระบบ
                    </span>
                </button>
            </div>
        </aside>
    );
}
