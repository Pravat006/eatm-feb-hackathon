"use client";

import { useAuthStore } from "@/lib/stores/auth.store";
import { useRouter } from "next/navigation";

export function SkipOnboardingButton() {
    const skipOnboarding = useAuthStore((state) => state.skipOnboarding);
    const router = useRouter();

    const handleSkip = () => {
        skipOnboarding();
        router.push("/dashboard");
    };

    return (
        <button
            onClick={handleSkip}
            className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-black transition-colors"
        >
            Skip for now →
        </button>
    );
}
