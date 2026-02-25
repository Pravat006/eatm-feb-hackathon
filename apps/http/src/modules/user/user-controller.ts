import { asyncHandler } from "@/utils/async-handler";
import { ApiResponse } from "@/interface/api-response";
import status from "http-status";
import userService from "./user-service";
import { ApiError } from "@/interface";
import db from "@/services/db";


/**
 * Get current user profile
 */
export const getProfile = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new ApiError(status.UNAUTHORIZED, "Not authenticated");
    }

    const userData = await userService.getUserProfile(user.id);

    return res.status(status.OK).json(
        new ApiResponse(status.OK, "User profile retrieved successfully", userData)
    );
});

/**
 * Promote user role (Admin only)
 */
export const promoteUser = asyncHandler(async (req, res) => {
    const { id: targetUserId } = req.params;
    const { role: newRole } = req.body;

    if (!["MANAGER", "ADMIN", "USER"].includes(newRole)) {
        throw new ApiError(status.BAD_REQUEST, "Invalid role specified");
    }

    const updatedUser = await userService.updateUserRole(targetUserId as string, newRole);

    return res.status(status.OK).json(
        new ApiResponse(status.OK, `User promoted to ${newRole} successfully`, updatedUser)
    );
});

/**
 * Assign User to Campus
 */
export const joinCampus = asyncHandler(async (req, res) => {
    const { campusId } = req.body;
    const userId = (req.user as any).id;

    if (!campusId) {
        throw new ApiError(status.BAD_REQUEST, "campusId is required");
    }

    const campus = await db.campus.findUnique({ where: { id: campusId } });

    if (!campus || campus.status !== "ACTIVE") {
        throw new ApiError(status.NOT_FOUND, "Campus not found or not active");
    }

    const updatedUser = await db.user.update({
        where: { id: userId },
        data: { campusId },
        include: { campus: true }
    });

    return res.status(status.OK).json(
        new ApiResponse(status.OK, "Successfully joined the campus", updatedUser)
    );
});

