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
        { icon: Heart, label: "\u0e1a\u0e23\u0e34\u0e01\u0e32\u0e23\u0e42\u0e20\u0e0a\u0e19\u0e32\u0e01\u0e32\u0e23", href: "/dashboard/nutrition", roles: ["patient", "admin"] },
        { icon: Calendar, label: "\u0e1b\u0e0f\u0e34\u0e17\u0e34\u0e19", href: "/dashboard/calendar", roles: ["patient", "nutritionist", "admin"] },
        { icon: Clock, label: "\u0e08\u0e31\u0e14\u0e01\u0e32\u0e23\u0e40\u0e27\u0e25\u0e32\u0e17\u0e33\u0e07\u0e32\u0e19", href: "/dashboard/nutritionists/schedule", roles: ["nutritionist", "admin"] },
        { icon: MessageSquare, label: "\u0e02\u0e49\u0e2d\u0e04\u0e27\u0e32\u0e21", href: "/dashboard/chat", roles: ["patient", "nutritionist", "admin"] },
        { icon: Utensils, label: "\u0e23\u0e49\u0e32\u0e19\u0e2d\u0e32\u0e2b\u0e32\u0e23\u0e2a\u0e38\u0e02\u0e20\u0e32\u0e1e", href: "/dashboard/healthymenu", roles: ["patient", "admin"] },
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
            <Link href="/" className="flex items-center gap-3 mb-10 px-2 group">
                <div className="w-8 h-8 bg-[#C6E065] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-lg">WM</span>
                </div>
                <span className="font-black text-[#3d3522] text-xl tracking-wide">WellMate</span>
            </Link>

            <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                {filteredMenuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={`${item.href}-${item.label}`}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                                isActive
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

            <div className="mt-6 mb-6">
                <div className="bg-[#C6E065] p-5 rounded-[32px] text-center shadow-lg shadow-[#C6E065]/20">
                    <p className="text-xs font-bold mb-1 text-[#3d3522]">{"\u0e40\u0e23\u0e34\u0e48\u0e21\u0e15\u0e49\u0e19\u0e2a\u0e38\u0e02\u0e20\u0e32\u0e1e\u0e14\u0e35\u0e01\u0e31\u0e1a\u0e40\u0e23\u0e32"}</p>
                    <p className="font-black text-base mb-2 text-[#3d3522]">{"\u0e23\u0e31\u0e1a\u0e2a\u0e34\u0e17\u0e18\u0e34\u0e4c\u0e43\u0e0a\u0e49\u0e07\u0e32\u0e19\u0e1f\u0e23\u0e35 1 \u0e40\u0e14\u0e37\u0e2d\u0e19"}</p>
                    <p className="text-[10px] mb-4 text-[#4A6707] font-bold">{"\u0e40\u0e02\u0e49\u0e32\u0e16\u0e36\u0e07\u0e1f\u0e35\u0e40\u0e08\u0e2d\u0e23\u0e4c\u0e1e\u0e23\u0e35\u0e40\u0e21\u0e35\u0e22\u0e21\u0e17\u0e31\u0e49\u0e07\u0e2b\u0e21\u0e14"}</p>
                    <button className="bg-[#3d3522] text-white hover:bg-black text-[10px] font-bold py-2.5 px-4 rounded-2xl w-full transition-all active:scale-95 shadow-md">
                        {"\u0e2a\u0e21\u0e31\u0e04\u0e23\u0e15\u0e2d\u0e19\u0e19\u0e35\u0e49\u0e40\u0e25\u0e22!"}
                    </button>
                </div>
            </div>

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
