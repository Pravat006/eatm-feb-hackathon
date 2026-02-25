"use client";

import { useCampusAuth } from "@/lib/hooks/use-campus-auth";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
    const { isLoaded } = useCampusAuth();

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground text-xs uppercase font-bold tracking-widest">
                Synchronizing Core...
            </div>
        );
    }

    return <>{children}</>;
}
