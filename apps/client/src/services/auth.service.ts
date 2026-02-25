import api from "./api";

export interface UserProfile {
    id: string;
    email: string;
    role: "ADMIN" | "MANAGER" | "USER" | "VIEWER";
    campusId?: string;
    onboarded: boolean;
}

export const authService = {
    getMe: async (): Promise<UserProfile> => {
        const response: any = await api.get("/api/user/me"); // eslint-disable-line @typescript-eslint/no-explicit-any
        return response.data;
    },

    syncClerkUser: async (): Promise<UserProfile> => {
        const response: any = await api.post("/api/user/sync"); // eslint-disable-line @typescript-eslint/no-explicit-any
        return response.data;
    }
};
