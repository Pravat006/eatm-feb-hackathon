import request from 'supertest';
import express from 'express';
import { ticketRouter } from '@/modules/ticket/ticket-route';
import { errorHandler } from '@/middlewares';
import db from '@repo/db';
import * as redis from '@repo/redis';
import * as gemini from '@/services/ai/gemini';
import cookieParser from 'cookie-parser';

jest.mock('@repo/db');
jest.mock('@repo/redis');
jest.mock('@clerk/clerk-sdk-node');
jest.mock('@/middlewares/auth-middleware', () => {
    return jest.fn((req, res, next) => {
        const auth = req.headers.authorization;
        if (auth === 'Bearer admin_token') {
            req.user = { id: 'admin_1', role: 'ADMIN', clerkId: 'admin_clerk', email: 'admin@test.com', campusId: 'c1' };
            next();
        } else if (auth === 'Bearer user_token') {
            req.user = { id: 'user_1', role: 'USER', clerkId: 'user_clerk', email: 'user@test.com', campusId: 'c1' };
            next();
        } else {
            res.status(401).json({ error: 'Auth failed' });
        }
    });
});
jest.mock('@/services/ai/gemini', () => ({
    analyzeComplaint: jest.fn().mockResolvedValue({
        category: 'Electrical',
        priority: 'HIGH',
        summary: 'Exposed wire risk',
        isHazard: true
    })
}));

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/tickets', ticketRouter);
app.use(errorHandler);

describe('Ticket Routes', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/tickets', () => {
        it('should validate and create a ticket', async () => {
            const ticketData = {
                title: 'Broken Light in A block',
                description: 'The main hall light is hanging by a wire',
                location: 'Block A, Floor 1'
            };

            const mockTicket = { id: 'ticket_1', ...ticketData, status: 'OPEN' };
            (db.ticket.create as jest.Mock).mockResolvedValue(mockTicket);

            const res = await request(app)
                .post('/api/tickets')
                .set('Authorization', 'Bearer user_token')
                .send(ticketData);

            if (res.status !== 201) {
                console.error("DEBUG ERROR", res.body);
            }

            expect(res.status).toBe(201);
            expect(res.body.data.title).toBe(ticketData.title);
            expect(res.body.data.aiAnalysis.priority).toBe('HIGH');

            // Verify publisher called for real-time update
            expect(redis.publish).toHaveBeenCalledWith(
                'system:notifications',
                expect.objectContaining({ type: 'TICKET_CREATED' })
            );
        });

        it('should fail validation without description', async () => {
            const res = await request(app)
                .post('/api/tickets')
                .set('Authorization', 'Bearer user_token')
                .send({ title: 'Test', location: 'Test' }); // Missing description

            expect(res.status).toBe(400); // Validation failure
        });
    });

    describe('GET /api/tickets/all', () => {
        it('should block non-admins from getting all tickets', async () => {
            const res = await request(app)
                .get('/api/tickets/all')
                .set('Authorization', 'Bearer user_token');

            expect(res.status).toBe(403);
        });

        it('should allow admins to get all tickets', async () => {
            (db.ticket.findMany as jest.Mock).mockResolvedValue([{ id: 'ticket_1' }]);

            const res = await request(app)
                .get('/api/tickets/all')
                .set('Authorization', 'Bearer admin_token');

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveLength(1);
        });
    });
});
