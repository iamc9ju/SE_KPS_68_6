"use client";

import React from "react";
import { useRouter } from "next/navigation";
import NutritionistSidebar from "@/components/nutritionist/NutritionistSidebar";
import BackgroundPattern from "@/components/dashboard/BackgroundPattern";
import { useAuthStore } from "@/store/auth-store";

export default function NutritionistLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mounted, setMounted] = React.useState(false);
    const router = useRouter();
    const user = useAuthStore((state) => state.user);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    React.useEffect(() => {
        if (!mounted) return;

        // ถ้ายังไม่ได้ล็อกอิน → ไปหน้า login
        if (!user) {
            router.replace("/login");
            return;
        }

        // ถ้าล็อกอินแล้วแต่ไม่ใช่ nutritionist → ไปหน้า dashboard ปกติ
        if (user.role !== "nutritionist") {
            router.replace("/dashboard");
            return;
        }
    }, [mounted, user, router]);

    if (!mounted) return null;

    // ไม่แสดง UI ถ้ายังไม่ผ่านการตรวจสอบสิทธิ์
    if (!user || user.role !== "nutritionist") {
        return (
            <div className="flex h-screen items-center justify-center bg-[#fffbf5]">
                <div className="animate-spin w-8 h-8 border-4 border-[#C6E065] border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#fffbf5] font-sans text-[#3d3522] overflow-hidden relative">
            <BackgroundPattern />

            {/* Sidebar */}
            <NutritionistSidebar />

            {/* Main Content Area */}
            {children}
        </div>
    );
}

