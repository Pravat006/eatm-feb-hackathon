import { asyncHandler } from "@/utils/async-handler";
import { Request, Response } from "express";
import status from "http-status";
import ticketService from "./ticket-service";
import { ApiError } from "@/interface";

export const createTicket = asyncHandler(async (req: Request, res: Response) => {
    const { title, description, location, imageUrl } = req.body;
    const creatorId = (req.user as any).id;
    const campusId = (req.user as any).campusId;

    if (!campusId) {
        throw new ApiError(status.FORBIDDEN, "You must belong to a Campus to create a ticket.");
    }

    const result = await ticketService.createTicket({ title, description, location, imageUrl }, creatorId, campusId);

    res.status(status.CREATED).json({
        message: "Ticket raised successfully",
        data: result
    });
});

export const getMyTickets = asyncHandler(async (req: Request, res: Response) => {
    const creatorId = (req.user as any).id;
    const campusId = (req.user as any).campusId;

    if (!campusId) {
        return res.status(status.OK).json({ data: [] });
    }

    const tickets = await ticketService.getMyTickets(creatorId, campusId);
    res.status(status.OK).json({ data: tickets });
});

export const getAllTickets = asyncHandler(async (req: Request, res: Response) => {
    const campusId = (req.user as any).campusId;

    if (!campusId) {
        return res.status(status.OK).json({ data: [] });
    }

    const tickets = await ticketService.getAllTickets(campusId);
    res.status(status.OK).json({ data: tickets });
});

export const updateTicketStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status: ticketStatus } = req.body;

    const ticket = await ticketService.updateTicketStatus(id as string, ticketStatus);

    res.status(status.OK).json({
        message: "Ticket status updated",
        data: ticket
    });
});
