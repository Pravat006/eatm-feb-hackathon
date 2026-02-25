import { asyncHandler } from "@/utils/async-handler";
import { Request, Response } from "express";
import status from "http-status";
import ticketService from "./ticket-service";

export const createTicket = asyncHandler(async (req: Request, res: Response) => {
    const { title, description, location, imageUrl } = req.body;
    const studentId = (req.user as any).id;

    const result = await ticketService.createTicket({ title, description, location, imageUrl }, studentId);

    res.status(status.CREATED).json({
        message: "Ticket raised successfully",
        data: result
    });
});

export const getMyTickets = asyncHandler(async (req: Request, res: Response) => {
    const studentId = (req.user as any).id;
    const tickets = await ticketService.getMyTickets(studentId);
    res.status(status.OK).json({ data: tickets });
});

export const getAllTickets = asyncHandler(async (req: Request, res: Response) => {
    const tickets = await ticketService.getAllTickets();
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
