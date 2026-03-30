"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function HealthProfileGuardInner({ children }: { children: React.ReactNode }) {
    const { user } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!user) return;

        // Only enforce for patients
        if (user.role === "patient") {
            const isHealthDataPath = pathname === "/healthdata";
            const allowedPaths = ["/auth/sign-out", "/auth/logout"];
            const isAllowedPath = allowedPaths.includes(pathname);

            if (user.isProfileComplete === false && !isHealthDataPath && !isAllowedPath) {
                console.log("Redirecting to healthdata: profile incomplete");
                router.replace("/healthdata");
            } else if (user.isProfileComplete === true && isHealthDataPath) {
                console.log("Redirecting to dashboard: profile complete");
                router.replace("/dashboard");
            }
        }
    }, [user, pathname, router]);

    return children;
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                        refetchOnWindowFocus: false,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <HealthProfileGuardInner>
                {children}
            </HealthProfileGuardInner>
        </QueryClientProvider>
    );
}
