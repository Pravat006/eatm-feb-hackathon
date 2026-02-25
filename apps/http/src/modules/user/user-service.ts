import db from "@/services/db";
import { ApiError } from "@/interface";
import status from "http-status";

class UserService {
    async getUserProfile(userId: string) {
        try {
            const user = await db.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    updatedAt: true,
                    campusId: true,
                    campus: true,
                }
            });

            if (!user) {
                throw new ApiError(status.NOT_FOUND, "User not found");
            }
            return user;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(
                status.INTERNAL_SERVER_ERROR,
                "Something went wrong while fetching uer profile"
            );
        }
    }

    async updateUserRole(userId: string, role: any) {
        try {
            const user = await db.user.update({
                where: { id: userId },
                data: { role },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    updatedAt: true,
                    campusId: true,
                    campus: true,
                }
            });

            return user;
        } catch (error) {
            throw new ApiError(
                status.INTERNAL_SERVER_ERROR,
                "Failed to update user role"
            );
        }
    }
}

export default new UserService();
