import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/auth.store";
import { setApiToken } from "@/services/api";
import { usePathname, useRouter } from "next/navigation";

export function useCampusAuth() {
    const { isLoaded, userId, getToken } = useAuth();
    const { user, initialize, hasSkippedOnboarding, isLoading } = useAuthStore();
    const pathname = usePathname();
    const router = useRouter();

    // 1. Token Sync & Database Profile Initialization
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

    // 2. Strong Role-Based Routing
    useEffect(() => {
        if (!isLoaded || isLoading) return;

        const isPublicRoute = pathname === "/" || pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up") || pathname?.startsWith("/login") || pathname?.startsWith("/register");
        if (isPublicRoute) return;

        if (userId) {
            const isSuperAdmin = user?.role === "SUPER_ADMIN";
            const needsOnboarding = !isSuperAdmin && !user?.campusId && !hasSkippedOnboarding;
            const isOnOnboardingPage = pathname === "/onboarding";

            if (needsOnboarding && !isOnOnboardingPage) {
                // If they have no campus and aren't super admin, force them to onboarding
                router.push("/onboarding");
            } else if (isOnOnboardingPage && (user?.campusId || isSuperAdmin)) {
                // If they are on onboarding but already have a campus/role, kick them out
                if (isSuperAdmin) {
                    router.push("/super-admin");
                } else {
                    router.push("/dashboard");
                }
            }
        }
    }, [isLoaded, userId, user, hasSkippedOnboarding, pathname, router, isLoading]);

    return {
        isLoaded: isLoaded && !isLoading,
        isAuthenticated: !!userId,
        user
    };
}
