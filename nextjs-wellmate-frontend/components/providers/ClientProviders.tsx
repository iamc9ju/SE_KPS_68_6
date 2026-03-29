"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PUBLIC_PATHS = ["/", "/login", "/register"];

function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const isPublicPath = PUBLIC_PATHS.includes(pathname);

        // Redirect unauthenticated users to login (skip public paths)
        if (!user && !isPublicPath) {
            router.replace("/login");
            return;
        }

        // Redirect authenticated users away from login/register
        if (user && (pathname === "/login" || pathname === "/register")) {
            const dest =
                user.role === "admin" ? "/dashboard/admindashboard" :
                user.role === "food_partner" ? "/dashboard" :
                user.role === "patient" ? "/healthdata" :
                "/dashboard";
            router.replace(dest);
            return;
        }

        // Health profile guard for patients
        if (user && user.role === "patient" && user.isProfileComplete === false) {
            const allowedPaths = ["/healthdata", "/auth/sign-out", "/auth/logout"];
            if (!allowedPaths.includes(pathname)) {
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
            <AuthGuard>
                {children}
            </AuthGuard>
        </QueryClientProvider>
    );
}
