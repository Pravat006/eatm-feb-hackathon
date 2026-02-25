import { asyncHandler } from "@/utils/async-handler";
import { ApiResponse } from "@/interface/api-response";
import { ApiError } from "@/interface";
import status from "http-status";

/**
 * Auth via Clerk — backend has no register/login/logout endpoints.
 * Users authenticate on the frontend with Clerk and send a Clerk JWT.
 * The auth-middleware validates it.
 *
 * This controller provides only a health/ping endpoint for the auth router.
 */
export const authStatus = asyncHandler(async (_req, res) => {
    return res
        .status(status.OK)
        .json(new ApiResponse(status.OK, "Auth handled by Clerk. Use Clerk SDK on the frontend."));
});

// Kept as named export to avoid breaking any existing imports
export const logout = asyncHandler(async (_req, res) => {
    // Clerk session is managed frontend-side; nothing to clear server-side.
    return res
        .status(status.OK)
        .json(new ApiResponse(status.OK, "Logout handled client-side via Clerk."));
});
