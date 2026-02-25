import axios, { AxiosInstance } from "axios";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/api/v0";

export const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Token injector — call this from a client component once Clerk is ready
export function setApiToken(token: string | null) {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Pass intended role if set from signup/login pages
        if (typeof window !== "undefined") {
            const intendedRole = localStorage.getItem("intended_role");
            if (intendedRole) {
                api.defaults.headers.common["x-intended-role"] = intendedRole;
                localStorage.removeItem("intended_role");
            }
        }
    } else {
        delete api.defaults.headers.common["Authorization"];
        delete api.defaults.headers.common["x-intended-role"];
    }
}

// Response interceptor
api.interceptors.response.use(
    (response) => {
        // Unwrap the ApiResponse wrapper: { success, message, data } -> data
        return response.data?.data !== undefined ? { ...response, data: response.data.data } : response;
    },
    (error) => {
        const message = error.response?.data?.message || error.message || "Unknown error";
        console.warn("[API Error]:", message);
        return Promise.reject(error);
    }
);

export default api;
