import api from "./api";
import { UserDto } from "@repo/shared";

export const userService = {
    // Get current authenticated user's profile
    getMe: async (): Promise<UserDto> => {
        const response = await api.get("/user/profile");
        return response.data;
    },

    // Update user profile
    updateProfile: async (data: Partial<UserDto>): Promise<UserDto> => {
        const response = await api.patch("/user/profile", data);
        return response.data;
    },

    // Join a campus
    joinCampus: async (campusId: string): Promise<UserDto> => {
        const response = await api.put("/user/campus", { campusId });
        return response.data;
    }
};
