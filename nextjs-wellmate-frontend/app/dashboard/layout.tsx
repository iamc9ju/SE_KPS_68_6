"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import BackgroundPattern from "@/components/dashboard/BackgroundPattern";
import { useCartStore } from "@/store/cart-store";
import RightSidebar from "@/components/dashboard/RightSidebar";
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mounted, setMounted] = React.useState(false);
    const pathname = usePathname();
    const isOpen = useCartStore((state) => state.isOpen);
    const setIsOpen = useCartStore((state) => state.setIsOpen);
    const useStandaloneLayout =
        pathname === "/dashboard/progress" ||
        pathname.startsWith("/dashboard/admindashboard");

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    if (useStandaloneLayout) {
        return children;
    }

    return (
        <div className="flex h-screen bg-[#fffbf5] font-sans text-[#3d3522] overflow-hidden relative">
            <BackgroundPattern />
            <Sidebar />
            {children}
            <RightSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
    );
}
