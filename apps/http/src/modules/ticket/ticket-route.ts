import { Router } from "express";
import { createTicket, getAllTickets, getMyTickets, updateTicketStatus } from "./ticket-controller";
import authMiddleware from "@/middlewares/auth-middleware";
import { validateRequest, requireAdmin } from "@/middlewares";
import { createTicketSchema, updateTicketStatusSchema } from "./ticket-validation";

const router = Router();

// Student Routes
router.post(
    "/",
    authMiddleware,
    validateRequest(createTicketSchema),
    createTicket
);

router.get(
    "/my-tickets",
    authMiddleware,
    getMyTickets
);

// Admin Routes
router.get(
    "/all",
    authMiddleware,
    requireAdmin,
    getAllTickets
);

router.patch(
    "/:id/status",
    authMiddleware,
    requireAdmin,
    validateRequest(updateTicketStatusSchema),
    updateTicketStatus
);

export const ticketRouter = router;
