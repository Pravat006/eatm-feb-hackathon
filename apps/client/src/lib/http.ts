import axios from "axios";
import { auth } from "@clerk/nextjs/server";

const API_BASE_URL = process.env.API_URL || "http://localhost:3001/api/v0";

export const http = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Automatically inject Clerk token into requests
http.interceptors.request.use(async (config) => {
    try {
        const { getToken } = await auth();
        const token = await getToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            // Also set cookies manually so the Express middleware can find it
            config.headers.Cookie = `__session=${token}`;
        }
    } catch {
        // We might be executing this on the client side, handle gracefully
        console.warn("Could not retrieve Clerk token server-side");
    }

    return config;
});
