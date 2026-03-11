"use client";

import { useAuthStore } from "@/store/auth-store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HealthProfileGuard({ children }: { children: React.ReactNode }) {
    const { user } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Only enforce for patients
        if (user && user.role === "patient" && user.isProfileComplete === false) {
            // List of allowed paths even if profile is incomplete
            const allowedPaths = ["/healthdata", "/auth/sign-out", "/auth/logout"];

            if (!allowedPaths.includes(pathname)) {
                console.log("Redirecting to healthdata: profile incomplete");
                router.push("/healthdata");
            }
        }
    }, [user, pathname, router]);

    return <>{children}</>;
}
