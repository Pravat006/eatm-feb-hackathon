import { asyncHandler } from "@/utils/async-handler";
import { ApiResponse } from "@/interface/api-response";
import status from "http-status";
import { ApiError } from "@/interface";
import db from "@/services/db";
import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "@/config";
import { logger } from "@repo/logger";
import { client } from "@repo/redis";

const genAI = new GoogleGenerativeAI((config as any).GEMINI_API_KEY as string);

export const chatWithAI = asyncHandler(async (req, res) => {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
        throw new ApiError(status.BAD_REQUEST, "Message is required");
    }

    try {
        // Fetch some public aggregate stats to give the AI context
        const totalTickets = await db.ticket.count();
        const resolvedTickets = await db.ticket.count({ where: { status: 'RESOLVED' } });
        const totalCampuses = await db.campus.count({ where: { status: 'ACTIVE' } });
        const categories = await db.ticket.groupBy({
            by: ['category'],
            _count: { category: true }
        });

        const systemPrompt = `
You are the "Care for Campus AI" public assistant, living on the landing page of the application.
Your goal is to answer questions from visitors (students, staff, general public) about what this platform does and how it helps the campus.

Platform Description:
Care for Campus AI is an intelligent infrastructure and facility management platform designed for multi-tenant organizations. Students can report issues, and the AI automatically categorizes them and assigns priority. Managers can track asset health and predict failures.

Current Global Public Stats:
- Active Campuses Onboarded: ${totalCampuses}
- Total complaints logged globally: ${totalTickets}
- Complaints successfully resolved: ${resolvedTickets}

Be helpful, concise, and enthusiastic. Do NOT provide personal data, specific user ticket details, or sensitive system information. If asked about submitting a ticket, tell them they need to "Register an Organization" or "Log In" first.
        `;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: systemPrompt });

        // Retrieve existing history from Redis
        const userIp = req.ip || req.socket.remoteAddress || "anonymous_ip";
        const redisKey = `ai_chat_history:${userIp}`;
        let history = [];

        try {
            const cachedHistory = await client.get(redisKey);
            if (cachedHistory) {
                history = JSON.parse(cachedHistory);
            }
        } catch (redisErr) {
            logger.warn("Redis history fetch failed:", redisErr);
        }

        // Initialize Chat Session with history
        const chat = model.startChat({
            history: history,
        });

        // Send new message
        const result = await chat.sendMessage(message);
        const text = result.response.text();

        // Save updated history back to Redis (expire after 30 minutes of inactivity)
        try {
            const updatedHistory = await chat.getHistory();
            await client.setex(redisKey, 30 * 60, JSON.stringify(updatedHistory));
        } catch (redisErr) {
            logger.warn("Redis history save failed:", redisErr);
        }

        return res.status(status.OK).json(
            new ApiResponse(status.OK, "AI Response generated", { reply: text })
        );

    } catch (error) {
        logger.error("AI Chat failed:", error);
        throw new ApiError(status.INTERNAL_SERVER_ERROR, "Failed to connect to AI assistant");
    }
});
