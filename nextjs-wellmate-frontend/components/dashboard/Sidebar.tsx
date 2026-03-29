"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutGrid,
    Users,
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
    Store,
    UserCheck,
    ShoppingBag,
    CalendarCheck,
    Banknote,
    RefreshCcw,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useAuth } from "@/hooks/useAuth";

type UserRole = "patient" | "nutritionist" | "food_partner" | "admin";

export default function Sidebar() {
    const pathname = usePathname();
    const { logoutUser } = useAuth();

    const menuItems = [
        { icon: LayoutGrid, label: "แดชบอร์ด", href: "/dashboard" },
        { icon: Calendar, label: "ประวัติการนัดหมาย", href: "/dashboard/appointments", roles: ["patient", "admin"] },
        { icon: Heart, label: "บริการโภชนาการ", href: "/dashboard/nutrition", roles: ["patient", "admin"] },
        { icon: Calendar, label: "ปฏิทิน", href: "/dashboard/calendar", roles: ["patient", "nutritionist", "admin"] },
        { icon: Clock, label: "จัดการเวลาทำงาน", href: "/dashboard/nutritionists/schedule", roles: ["nutritionist", "admin"] },
        { icon: MessageSquare, label: "ข้อความ", href: "/dashboard/chat", roles: ["patient", "nutritionist", "admin"] },
        { icon: Utensils, label: "ร้านอาหารสุขภาพ", href: "/dashboard/healthymenu", roles: ["patient"] },
        { icon: Utensils, label: "จัดการเมนู", href: "/dashboard/menu", roles: ["food_partner", "admin"] },
        { icon: Package, label: "รายการสั่งซื้อ", href: "/dashboard/orders", roles: ["patient"] },
        { icon: BookOpen, label: "แผนการกิน", href: "/dashboard/meal-plan", roles: ["patient", "nutritionist", "admin"] },
        { icon: ScrollText, label: "บันทึกอาหาร", href: "/dashboard/food-diary", roles: ["patient"] },
        { icon: BarChart2, label: "ความคืบหน้า", href: "/dashboard/progress", roles: ["patient", "admin"] },
        { icon: UserCog, label: "ตั้งค่า", href: "/dashboard/setting" },
    ];

    const userRole = useAuthStore((state) => state.user?.role);
    const isFoodPartner = userRole === "food_partner";
    const isAdmin = userRole === "admin";

    // Define specific items for food partner and admin to maintain their previous navigation structure
    const filteredMenuItems = isFoodPartner
        ? [
            { icon: LayoutGrid, label: "แดชบอร์ด", href: "/dashboard" },
            { icon: Package, label: "จัดการออเดอร์", href: "/dashboard/orders" },
            { icon: Utensils, label: "จัดการเมนู", href: "/dashboard/menu" },
            { icon: BookOpen, label: "ประวัติ", href: "/dashboard/history" },
            { icon: UserCog, label: "ตั้งค่า", href: "/dashboard/profile" },
        ]
        : isAdmin
            ? [
                { icon: LayoutGrid, label: "แดชบอร์ด", href: "/dashboard" },
                { icon: Users, label: "จัดการผู้ใช้", href: "/dashboard/patient" },
                { icon: Store, label: "จัดการร้านค้าพาร์ทเนอร์", href: "/dashboard/partners" },
                { icon: UserCheck, label: "อนุมัติโปรไฟล์นักโภชนาการ", href: "/dashboard/nutritionists" },
                { icon: ShoppingBag, label: "ติดตามออเดอร์", href: "/dashboard/admindashboard/orders" },
                { icon: CalendarCheck, label: "ติดตามการจอง", href: "/dashboard/admindashboard/bookings" },
                { icon: Banknote, label: "จ่ายเงินให้ร้านค้า", href: "/dashboard/admindashboard/payments" },
                { icon: RefreshCcw, label: "จัดการการคืนเงิน", href: "/dashboard/admindashboard/refunds" },
                { icon: BarChart2, label: "ข้อมูลเชิงวิเคราะห์", href: "/dashboard/admindashboard/analytics" },
                { icon: UserCog, label: "ตั้งค่า", href: "/dashboard/setting" },
            ]
            : menuItems.filter((item) => {
                if (!item.roles) return true;
                if (!userRole) return false;
                return item.roles.includes(userRole as UserRole);
            });

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
                    const isOrdersSection = item.href === "/dashboard/orders";
                    const isActive = isRoot
                        ? pathname === item.href
                        : isOrdersSection
                            ? pathname === item.href || pathname.startsWith(`${item.href}/`) || pathname.startsWith("/dashboard/tracking")
                            : pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                        <Link
                            key={`${item.href}-${item.label}`}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${isActive
                                ? isAdmin
                                    ? "bg-[#ffd980] text-[#7a5c00] font-bold shadow-md"
                                    : "bg-[#C6E065] text-[#3d3522] font-bold shadow-md"
                                : isAdmin
                                    ? "text-gray-500 hover:bg-[#fff8e1] hover:text-[#7a5c00]"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-[#3d3522]"
                                }`}
                        >
                            <item.icon
                                className={`w-5 h-5 ${isActive
                                    ? isAdmin ? "text-[#7a5c00]" : "text-[#3d3522]"
                                    : "text-gray-400"
                                    }`}
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
