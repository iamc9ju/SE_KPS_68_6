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
        if (user && user.role === "patient" && user.isProfileComplete === false) {
            const allowedPaths = ["/healthdata", "/auth/sign-out", "/auth/logout"];
            if (!allowedPaths.includes(pathname)) {
                console.log("Redirecting to healthdata: profile incomplete");
                router.push("/healthdata");
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
