"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/auth.store";
import { usePathname, useRouter } from "next/navigation";
import { setApiToken } from "@/services/api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { isLoaded, userId, getToken } = useAuth();
    const { user, initialize, hasSkippedOnboarding, isLoading } = useAuthStore();
    const pathname = usePathname();
    const router = useRouter();

    // Initialize workflow: set token, THEN initialize user
    useEffect(() => {
        if (!isLoaded) return;
        if (userId) {
            getToken().then((token) => {
                setApiToken(token);
                // Call initialize ONLY after token is set
                initialize().catch(console.error);
            });
        } else {
            setApiToken(null);
        }
    }, [isLoaded, userId, getToken, initialize]);

    // Role-based routing
    useEffect(() => {
        if (!isLoaded || isLoading) return;

        const isPublicRoute = pathname === "/" || pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up");
        if (isPublicRoute) return;

        if (userId) {
            const isSuperAdmin = user?.role === "SUPER_ADMIN";
            const needsOnboarding = !isSuperAdmin && !user?.campusId && !hasSkippedOnboarding;
            const isOnOnboardingPage = pathname === "/onboarding";

            if (needsOnboarding && !isOnOnboardingPage) {
                router.push("/onboarding");
            } else if (!needsOnboarding && isOnOnboardingPage) {
                if (isSuperAdmin) {
                    router.push("/super-admin");
                } else {
                    router.push("/dashboard");
                }
            }
        }
    }, [isLoaded, userId, user, hasSkippedOnboarding, pathname, router, isLoading]);

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground text-xs uppercase font-bold tracking-widest">
                Synchronizing Core...
            </div>
        );
    }

    return <>{children}</>;
}
