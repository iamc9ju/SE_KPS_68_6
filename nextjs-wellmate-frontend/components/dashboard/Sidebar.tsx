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

    const menuItems = [
        { icon: LayoutGrid, label: "\u0e41\u0e14\u0e0a\u0e1a\u0e2d\u0e23\u0e4c\u0e14", href: "/dashboard" },
        { icon: Calendar, label: "ประวัติการนัดหมาย", href: "/dashboard/appointments", roles: ["patient", "admin"] },
        { icon: Heart, label: "\u0e1a\u0e23\u0e34\u0e01\u0e32\u0e23\u0e42\u0e20\u0e0a\u0e19\u0e32\u0e01\u0e32\u0e23", href: "/dashboard/nutrition", roles: ["patient", "admin"] },
        { icon: Calendar, label: "ปฏิทิน", href: "/calendar", roles: ["patient", "nutritionist", "admin"] },
        { icon: Clock, label: "จัดการเวลาทำงาน", href: "/dashboard/nutritionists/schedule", roles: ["nutritionist", "admin"] },
        { icon: Clock, label: "จัดการวันลา", href: "/dashboard/nutritionists/leave", roles: ["nutritionist", "admin"] },
        { icon: MessageSquare, label: "ข้อความ", href: "/dashboard/chat", roles: ["patient", "nutritionist", "admin"] },
        { icon: Utensils, label: "\u0e23\u0e49\u0e32\u0e19\u0e2d\u0e32\u0e2b\u0e32\u0e23\u0e2a\u0e38\u0e02\u0e20\u0e32\u0e1e", href: "/healthymenu", roles: ["patient", "admin"] },
        { icon: Utensils, label: "\u0e08\u0e31\u0e14\u0e01\u0e32\u0e23\u0e40\u0e21\u0e19\u0e39", href: "/dashboard/menu", roles: ["food_partner", "admin"] },
        { icon: Package, label: "\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23\u0e2a\u0e31\u0e48\u0e07\u0e0b\u0e37\u0e49\u0e2d", href: "/dashboard/orders", roles: ["patient", "food_partner", "admin"] },
        { icon: BookOpen, label: "\u0e41\u0e1c\u0e19\u0e01\u0e32\u0e23\u0e01\u0e34\u0e19", href: "/dashboard/meal-plan", roles: ["patient", "nutritionist", "admin"] },
        { icon: ScrollText, label: "\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01\u0e2d\u0e32\u0e2b\u0e32\u0e23", href: "/dashboard/food-diary", roles: ["patient"] },
        { icon: BarChart2, label: "\u0e04\u0e27\u0e32\u0e21\u0e04\u0e37\u0e1a\u0e2b\u0e19\u0e49\u0e32", href: "/dashboard/progress", roles: ["patient", "admin"] },
        { icon: UserCog, label: "\u0e15\u0e31\u0e49\u0e07\u0e04\u0e48\u0e32", href: "/dashboard/setting" },
    ];

    const userRole = useAuthStore((state) => state.user?.role);
    const filteredMenuItems = menuItems.filter((item) => {
        if (!item.roles) return true;
        if (!userRole) return false;
        return item.roles.includes(userRole as UserRole);
    });

    return (
        <aside className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-100 flex flex-col p-6 z-20 shadow-sm">
            <Link href="/" className="flex items-center justify-center mb-10 px-2 group">
                <img src="/logo.png" alt="WellMate Logo" className="h-20 w-auto group-hover:scale-110 transition-transform" />
            </Link>

            <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                {filteredMenuItems.map((item) => {
                    const isActive = pathname === item.href;
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

            <button
                onClick={logoutUser}
                className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all mt-auto"
            >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">{"\u0e2d\u0e2d\u0e01\u0e08\u0e32\u0e01\u0e23\u0e30\u0e1a\u0e1a"}</span>
            </button>
        </aside>
    );
}
