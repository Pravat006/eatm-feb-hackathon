import { asyncHandler } from "@/utils/async-handler";
import { ApiResponse } from "@/interface/api-response";
import status from "http-status";
import userService from "./user-service";
import { ApiError } from "@/interface";

/**
 * Get authenticated user info (minimal)
 */
export const getMe = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new ApiError(status.UNAUTHORIZED, "Not authenticated");
    }

    return res.status(status.OK).json(
        new ApiResponse(status.OK, "User info retrieved successfully", user)
    );
});


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

