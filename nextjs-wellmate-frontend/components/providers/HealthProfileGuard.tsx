"use client";

import { useAuthStore } from "@/store/auth-store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HealthProfileGuard({ children }: { children: React.ReactNode }) {
    const { user } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!user) return;

        // Only enforce for patients
        if (user.role === "patient") {
            const isHealthDataPath = pathname === "/healthdata";
            const isAllowedPath = ["/auth/sign-out", "/auth/logout"].includes(pathname);

            if (user.isProfileComplete === false && !isHealthDataPath && !isAllowedPath) {
                console.log("Redirecting to healthdata: profile incomplete");
                router.replace("/healthdata");
            } else if (user.isProfileComplete === true && isHealthDataPath) {
                console.log("Redirecting to dashboard: profile complete");
                router.replace("/dashboard");
            }
        }
    }, [user, pathname, router]);

    return <>{children}</>;
}
