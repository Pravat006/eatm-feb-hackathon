import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { userService } from "@/services/user.service";
import { UserDto } from "@repo/shared";

interface AuthState {
    user: UserDto | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    hasSkippedOnboarding: boolean;

    setUser: (user: UserDto | null) => void;
    clearError: () => void;
    initialize: () => Promise<void>;
    skipOnboarding: () => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            hasSkippedOnboarding: false,

            setUser: (user) => set({ user, isAuthenticated: !!user }),

            clearError: () => set({ error: null }),

            initialize: async () => {
                set({ isLoading: true });
                try {
                    const user = await userService.getMe();
                    set({ user, isAuthenticated: true, isLoading: false });
                } catch {
                    set({ user: null, isAuthenticated: false, isLoading: false });
                }
            },

            skipOnboarding: () => set({ hasSkippedOnboarding: true }),

            logout: () => set({ user: null, isAuthenticated: false, hasSkippedOnboarding: false }),
        }),
        {
            name: "campus-care-auth",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
                hasSkippedOnboarding: state.hasSkippedOnboarding,
            }),
        }
    )
);
