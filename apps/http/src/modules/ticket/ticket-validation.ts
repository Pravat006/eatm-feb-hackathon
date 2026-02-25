import { z } from "zod";

export const createTicketSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    location: z.string().min(1, "Location is required"),
    imageUrl: z.string().optional(),
});

export const updateTicketStatusSchema = z.object({
    status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
});
