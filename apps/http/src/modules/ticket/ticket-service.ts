import db from "@/services/db";
import { analyzeComplaint } from "../../services/ai/gemini";
import { logger } from "@repo/logger";
import { publish } from "@repo/redis";
import { WsNotificationDto } from "@repo/shared";

class TicketService {
    async createTicket(data: any, studentId: string) {
        logger.info("Analyzing ticket description with Gemini...");
        const aiResult = await analyzeComplaint(data.description);

        const ticket = await db.ticket.create({
            data: {
                ...data,
                studentId,
                category: aiResult.category,
                priority: aiResult.priority,
                status: "OPEN",
            },
        });

        const notification: WsNotificationDto = {
            type: "TICKET_CREATED",
            ticketId: ticket.id,
            title: ticket.title,
            priority: ticket.priority,
            userId: "ADMIN",
        };
        publish("system:notifications", notification).catch(err => logger.error("Failed to publish ticket creation", err));

        return { ...ticket, aiAnalysis: aiResult };
    }

    async getMyTickets(studentId: string) {
        return await db.ticket.findMany({
            where: { studentId },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getAllTickets() {
        return await db.ticket.findMany({
            include: {
                student: {
                    select: { name: true, email: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async updateTicketStatus(id: string, status: any) {
        const ticket = await db.ticket.update({
            where: { id },
            data: { status },
        });

        const notification: WsNotificationDto = {
            type: "TICKET_UPDATED",
            ticketId: ticket.id,
            status: ticket.status,
            userId: ticket.studentId,
        };
        publish("system:notifications", notification).catch(err => logger.error("Failed to publish ticket update", err));

        return ticket;
    }
}

export default new TicketService();
