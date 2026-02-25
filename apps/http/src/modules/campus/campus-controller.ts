import { asyncHandler } from "@/utils/async-handler";
import { Request, Response } from "express";
import status from "http-status";
import campusService from "./campus-service";
import { ApiError } from "@/interface";
import { CampusStatus } from "@repo/shared";

// 1. Organization registers a new Campus
export const registerCampus = asyncHandler(async (req: Request, res: Response) => {
    const { name, type, contactEmail } = req.body;
    const userId = (req.user as any).id;

    const campus = await campusService.registerCampus({ name, type, contactEmail }, userId);

    res.status(status.CREATED).json({
        message: "Organization registration submitted successfully. Awaiting Super Admin approval.",
        data: campus
    });
});

// 2. Super Admin views all pending campuses
export const getPendingCampuses = asyncHandler(async (req: Request, res: Response) => {
    const userRole = (req.user as any).role;
    if (userRole !== "SUPER_ADMIN") {
        throw new ApiError(status.FORBIDDEN, "Only Super Admins can view pending requests.");
    }

    const campuses = await campusService.getPendingCampuses();

    res.status(status.OK).json({ data: campuses });
});

// 3. Super Admin approves or rejects a campus
export const reviewCampusRequest = asyncHandler(async (req: Request, res: Response) => {
    const userRole = (req.user as any).role;
    const { id } = req.params;
    const { action } = req.body; // 'APPROVE' or 'REJECT'

    if (userRole !== "SUPER_ADMIN") {
        throw new ApiError(status.FORBIDDEN, "Only Super Admins can review requests.");
    }

    if (!['APPROVE', 'REJECT'].includes(action)) {
        throw new ApiError(status.BAD_REQUEST, "Action must be APPROVE or REJECT.");
    }

    const newStatus = action === 'APPROVE' ? CampusStatus.ACTIVE : CampusStatus.REJECTED;

    const updatedCampus = await campusService.reviewCampusRequest(id as string, newStatus);

    res.status(status.OK).json({
        message: `Campus request ${newStatus.toLowerCase()} successfully.`,
        data: updatedCampus
    });
});

// 4. Get active campuses for users to select
export const getActiveCampuses = asyncHandler(async (req: Request, res: Response) => {
    const campuses = await campusService.getActiveCampuses();

    res.status(status.OK).json({ data: campuses });
});

// 5. Admin invites a staff member
export const inviteStaff = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    const userId = (req.user as any).id;
    const userRole = (req.user as any).role;

    if (userRole !== "ADMIN") {
        throw new ApiError(status.FORBIDDEN, "Only Organization Admins can invite staff.");
    }

    try {
        const staff = await campusService.inviteStaff(userId, email);
        res.status(status.CREATED).json({
            message: "Staff member invited successfully. They can now create an account using this email.",
            data: staff
        });
    } catch (error: any) {
        throw new ApiError(status.BAD_REQUEST, error.message || "Failed to invite staff");
    }
});

// 6. Admin views all their campus members
export const getCampusMembers = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req.user as any).id;
    const userRole = (req.user as any).role;

    // Only Admin or Manager can view their entire team
    if (!["ADMIN", "MANAGER"].includes(userRole)) {
        throw new ApiError(status.FORBIDDEN, "Unauthorized to view campus members.");
    }

    try {
        const members = await campusService.getCampusMembers(userId);
        res.status(status.OK).json({ data: members });
    } catch (error: any) {
        throw new ApiError(status.BAD_REQUEST, error.message || "Failed to fetch members");
    }
});
