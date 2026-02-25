import request from 'supertest';
import express from 'express';
import { aiRouter } from '@/modules/ai/ai-route';
import { errorHandler } from '@/middlewares';
import db from '@repo/db';
import * as gemini from '@google/generative-ai';
import cookieParser from 'cookie-parser';

jest.mock('@repo/db');
// Mocking the generated content directly to avoid actual API calls
jest.mock('@repo/redis', () => ({
    client: {
        get: jest.fn().mockResolvedValue(null),
        setex: jest.fn().mockResolvedValue('OK')
    }
}));

jest.mock('@google/generative-ai', () => {
    return {
        GoogleGenerativeAI: jest.fn().mockImplementation(() => {
            return {
                getGenerativeModel: jest.fn().mockReturnValue({
                    startChat: jest.fn().mockReturnValue({
                        sendMessage: jest.fn().mockResolvedValue({
                            response: { text: () => "This is a mocked AI response" }
                        }),
                        getHistory: jest.fn().mockResolvedValue([])
                    })
                })
            };
        })
    };
});

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/ai', aiRouter);
app.use(errorHandler);

describe('AI Chat Routes (Public)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/ai/chat', () => {
        it('should require a message body', async () => {
            const res = await request(app)
                .post('/api/ai/chat')
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.message).toMatch(/Message is required/i);
        });

        it('should return an AI response and query public stats', async () => {
            (db.ticket.count as jest.Mock)
                .mockResolvedValueOnce(150) // Total
                .mockResolvedValueOnce(120); // Resolved

            (db.ticket.groupBy as jest.Mock).mockResolvedValue([
                { category: 'Plumbing', _count: { category: 5 } }
            ]);

            const res = await request(app)
                .post('/api/ai/chat')
                .send({ message: "What does this platform do?" });

            expect(res.status).toBe(200);
            expect(res.body.data.reply).toBe("This is a mocked AI response");

            expect(db.ticket.count).toHaveBeenCalledTimes(2);
            expect(db.ticket.groupBy).toHaveBeenCalled();
        });
    });
});
