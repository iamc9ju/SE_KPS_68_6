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
        { icon: LayoutGrid, label: "\u0e41\u0e14\u0e0a\u0e1a\u0e2d\u0e23\u0e4c\u0e14", href: "/dashboard" },
        { icon: Calendar, label: "ประวัติการนัดหมาย", href: "/dashboard/appointments", roles: ["patient", "admin"] },
        { icon: Heart, label: "\u0e1a\u0e23\u0e34\u0e01\u0e32\u0e23\u0e42\u0e20\u0e0a\u0e19\u0e32\u0e01\u0e32\u0e23", href: "/dashboard/nutrition", roles: ["patient", "admin"] },
        { icon: Calendar, label: "ปฏิทิน", href: "/dashboard/calendar", roles: ["patient", "nutritionist", "admin"] },
        { icon: Clock, label: "จัดการเวลาทำงาน", href: "/dashboard/nutritionists/schedule", roles: ["nutritionist", "admin"] },
        { icon: Clock, label: "จัดการวันลา", href: "/dashboard/nutritionists/leave", roles: ["nutritionist", "admin"] },
        { icon: MessageSquare, label: "ข้อความ", href: "/dashboard/chat", roles: ["patient", "nutritionist", "admin"] },
        { icon: Utensils, label: "\u0e23\u0e49\u0e32\u0e19\u0e2d\u0e32\u0e2b\u0e32\u0e23\u0e2a\u0e38\u0e02\u0e20\u0e32\u0e1e", href: "/dashboard/healthymenu", roles: ["patient", "admin"] },
        { icon: Utensils, label: "\u0e08\u0e31\u0e14\u0e01\u0e32\u0e23\u0e40\u0e21\u0e19\u0e39", href: "/dashboard/menu", roles: ["food_partner", "admin"] },
        { icon: Package, label: "\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23\u0e2a\u0e31\u0e48\u0e07\u0e0b\u0e37\u0e49\u0e2d", href: "/dashboard/orders", roles: ["patient", "food_partner", "admin"] },
        { icon: BookOpen, label: "\u0e41\u0e1c\u0e19\u0e01\u0e32\u0e23\u0e01\u0e34\u0e19", href: "/dashboard/meal-plan", roles: ["patient", "nutritionist", "admin"] },
        { icon: ScrollText, label: "\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01\u0e2d\u0e32\u0e2b\u0e32\u0e23", href: "/dashboard/food-diary", roles: ["patient"] },
        { icon: BarChart2, label: "\u0e04\u0e27\u0e32\u0e21\u0e04\u0e37\u0e1a\u0e2b\u0e19\u0e49\u0e32", href: "/dashboard/progress", roles: ["patient", "admin"] },
        { icon: UserCog, label: "\u0e15\u0e31\u0e49\u0e07\u0e04\u0e48\u0e32", href: "/dashboard/setting" },
    ];

    const userRole = useAuthStore((state) => state.user?.role);
    const isFoodPartner = userRole === "food_partner";
    const filteredMenuItems = isFoodPartner
        ? [
              { icon: LayoutGrid, label: "แดชบอร์ด", href: "/Foodpartner/dashboard" },
              { icon: Utensils, label: "จัดการเมนู", href: "/Foodpartner/menu" },
              { icon: Package, label: "รายการสั่งซื้อ", href: "/Foodpartner/orders" },
              { icon: BookOpen, label: "ประวัติ", href: "/Foodpartner/history" },
              { icon: UserCog, label: "ตั้งค่า", href: "/Foodpartner/profile" },
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
            className={`w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-100 flex flex-col z-20 ${
                isFoodPartner ? "px-6 py-8 shadow-none" : "p-6 shadow-sm"
            }`}
        >
            <Link
                href="/"
                className={`flex items-center justify-center px-2 group ${
                    isFoodPartner ? "mb-12" : "mb-10"
                }`}
            >
                <img
                    src="/logo.png"
                    alt="WellMate Logo"
                    className={`${isFoodPartner ? "h-12" : "h-20"} w-auto group-hover:scale-110 transition-transform`}
                />
            </Link>

            <nav
                className={`flex-1 overflow-y-auto custom-scrollbar ${
                    isFoodPartner ? "space-y-4 pr-1" : "space-y-2 pr-2"
                }`}
            >
                {filteredMenuItems.map((item) => {
                    const isRoot = item.href === "/dashboard" || item.href === "/Foodpartner/dashboard";
                    const isActive = isRoot ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                        <Link
                            key={`${item.href}-${item.label}`}
                            href={item.href}
                            className={
                                isFoodPartner
                                    ? `flex items-center gap-4 px-2 py-2 text-sm transition-colors ${
                                          isActive
                                              ? "text-[#2f2a1d] font-semibold"
                                              : "text-[#8f96a3] hover:text-[#2f2a1d]"
                                      }`
                                    : `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                                          isActive
                                              ? "bg-[#C6E065] text-[#3d3522] font-bold shadow-md"
                                              : "text-gray-500 hover:bg-gray-50 hover:text-[#3d3522]"
                                      }`
                            }
                        >
                            <item.icon
                                className={
                                    isFoodPartner
                                        ? `w-5 h-5 ${
                                              isActive ? "text-[#6b7382]" : "text-[#b3bac5]"
                                          }`
                                        : `w-5 h-5 ${isActive ? "text-[#3d3522]" : "text-gray-400"}`
                                }
                            />
                            <span className="text-sm">{item.label}</span>
                        </Link>
                    );
                })}

            </nav>

            {isFoodPartner ? (
                <button
                    onClick={logoutUser}
                    className="mt-10 flex items-center gap-3 px-2 py-3 text-sm text-[#8f96a3] hover:text-[#2f2a1d] transition-colors"
                >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2f2a1d] text-white font-bold">
                        {userInitial.toUpperCase()}
                    </span>
                    <span className="font-medium">{"\u0e2d\u0e2d\u0e01\u0e08\u0e32\u0e01\u0e23\u0e30\u0e1a\u0e1a"}</span>
                </button>
            ) : (
                <button
                    onClick={logoutUser}
                    className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all mt-auto"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">
                        {"\u0e2d\u0e2d\u0e01\u0e08\u0e32\u0e01\u0e23\u0e30\u0e1a\u0e1a"}
                    </span>
                </button>
            )}
        </aside>
    );
}
