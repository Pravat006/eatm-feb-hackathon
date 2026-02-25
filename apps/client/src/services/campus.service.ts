import { api } from "./api";
import { CampusDto } from "@repo/shared";

export const campusService = {
    // Get all active campuses (public)
    getActive: async (): Promise<CampusDto[]> => {
        const response = await api.get("/campus/active");
        return response.data;
    },

    // Register a new campus (becomes PENDING)
    register: async (data: { name: string; type: string; contactEmail: string }): Promise<CampusDto> => {
        const response = await api.post("/campus/register", data);
        return response.data;
    },

    // User joins an existing campus
    join: async (campusId: string): Promise<void> => {
        await api.put("/user/campus", { campusId });
    },

    // Get pending campuses (Super Admin only)
    getPending: async (): Promise<CampusDto[]> => {
        const response = await api.get("/campus/pending");
        return response.data;
    },

    // Approve or reject a campus (Super Admin only)
    reviewRequest: async (id: string, action: "APPROVE" | "REJECT"): Promise<void> => {
        await api.patch(`/campus/${id}/review`, { action });
    },

    // Invite a staff member (Admin only)
    inviteStaff: async (email: string): Promise<Record<string, unknown>> => {
        const response = await api.post("/campus/invite", { email });
        return response.data;
    },

    // Get campus members (Admin/Manager only)
    getMembers: async (): Promise<Record<string, unknown>[]> => {
        const response = await api.get("/campus/members");
        return response.data;
    }
};
