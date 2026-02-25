"use server";

import { http } from "@/lib/http";
import { revalidatePath } from "next/cache";

export async function joinCampus(campusId: string) {
    try {
        // Send a PUT request for the current user to join the selected campus
        const res = await http.put("/user/campus", { campusId });

        revalidatePath("/"); // Force Next.js to re-fetch user data if cached

        return { success: true, data: res.data };
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        console.error("Error joining campus:", error);
        return {
            success: false,
            error: error.response?.data?.message || "Failed to join campus."
        };
    }
}

export async function registerCampus(data: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    try {
        const res = await http.post("/campus/register", data);

        // Revalidate the pending campus dashboard
        revalidatePath("/admin/organizations");

        return { success: true, data: res.data };
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        console.error("Error registering campus:", error);
        return {
            success: false,
            error: error.response?.data?.message || "Failed to submit registration."
        };
    }
}
