import axios, {
    AxiosError,
    AxiosInstance,
    InternalAxiosRequestConfig,
} from "axios";

const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URI || "/api/v0",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 30000,
});

// A separate instance for refreshing tokens to avoid interceptor deadlocks
export const refreshApi: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URI || "/api/v0",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 30000,
});

let isRefreshing = false;
let refreshQueue: Array<{
    resolve: () => void;
    reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
    refreshQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve();
    });
    refreshQueue = [];
};

// Response interceptor for handling 401 errors and token refresh
api.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
        const originalRequest = error.config as
            | (InternalAxiosRequestConfig & { _retry?: boolean })
            | undefined;

        if (!error.response || error.response.status !== 401 || !originalRequest) {
            return Promise.reject(error);
        }

        console.warn("[AXIOS] 401 Unauthorized detected at:", originalRequest.url);

        // If it's a login request failing with 401, don't try to refresh
        if (originalRequest.url?.includes('/auth/login')) {
            return Promise.reject(error);
        }

        if (originalRequest._retry) {
            console.error("[AXIOS] Request already retried once, logging out...");
            if (typeof window !== "undefined") {
                // Import auth store dynamically to avoid circular dependencies
                const { useAuthStore } = await import("./stores/auth.store");
                useAuthStore.getState().logout();
                window.location.href = "/login";
            }
            return Promise.reject(error);
        }

        if (isRefreshing) {
            console.log("[AXIOS] Already refreshing, queuing request:", originalRequest.url);
            return new Promise((resolve, reject) => {
                refreshQueue.push({
                    resolve: () => {
                        resolve(api(originalRequest));
                    },
                    reject,
                });
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            console.log("[AXIOS] Starting background token refresh...");

            // Call the refresh endpoint (cookies will be sent automatically with withCredentials)
            await refreshApi.post("/auth/refresh-tokens");

            console.log("[AXIOS] Token refresh successful, retrying original request...");

            processQueue(null);

            // Retry the original request with new token
            return api(originalRequest);
        } catch (err) {
            console.error("[AXIOS] Token refresh failed:", err);
            processQueue(err);
            if (typeof window !== "undefined") {
                const { useAuthStore } = await import("./stores/auth.store");
                useAuthStore.getState().logout();
                window.location.href = "/login";
            }
            return Promise.reject(err);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;
