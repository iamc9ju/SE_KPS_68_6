"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    FolderOpen,
    ClipboardList,
    LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function NutritionistSidebar() {
    const pathname = usePathname();
    const { logoutUser } = useAuth(); // assuming useAuth exists here as in regular user UI

    const navItems = [
        { name: "HOME", label: "HOME", href: "/nutritionist", icon: Home },
        { name: "MEDICAL RECORD", label: "MEDICAL RECORD", href: "/nutritionist/medical-record", icon: FolderOpen },
        { name: "NUTRITION PLAN", label: "NUTRITION PLAN", href: "/nutritionist/nutrition-plan", icon: ClipboardList },
    ];

    return (
        <aside className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-100 flex flex-col p-6 z-20 shadow-sm">
            <Link href="/" className="flex items-center gap-3 mb-10 px-2 group">
                <div className="w-8 h-8 bg-[#C6E065] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-lg">🍽️</span>
                </div>
                <span className="font-black text-[#3d3522] text-xl tracking-wide uppercase">
                    WellMate
                </span>
            </Link>

            <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/nutritionist" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${isActive
                                ? "bg-[#C6E065] text-[#3d3522] font-bold shadow-md"
                                : "text-gray-500 hover:bg-gray-50 hover:text-[#3d3522]"
                                }`}
                        >
                            <item.icon
                                className={`w-5 h-5 ${isActive ? "text-[#3d3522]" : "text-gray-400"}`}
                            />
                            <span className="text-sm font-bold uppercase tracking-wide">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <button
                onClick={logoutUser}
                className="flex items-center gap-3 px-4 py-3 text-[#3d3522] hover:text-white bg-orange-400 hover:bg-orange-500 rounded-2xl transition-all mt-auto shadow-sm"
            >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-black uppercase tracking-wide">LOG-OUT</span>
            </button>
        </aside>
    );
}
