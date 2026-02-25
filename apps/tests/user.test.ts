import request from 'supertest';
import express from 'express';
import { userSafeRouter } from '@/modules/user/user-route';
import { errorHandler } from '@/middlewares';
import db from '@repo/db';
import clerk from '@clerk/clerk-sdk-node';
import cookieParser from 'cookie-parser';

jest.mock('@repo/db');
jest.mock('@clerk/clerk-sdk-node');
jest.mock('@/middlewares/auth-middleware', () => {
    return jest.fn((req, res, next) => {
        const auth = req.headers.authorization;
        if (auth === 'Bearer admin_token') {
            req.user = { id: 'admin_1', role: 'ADMIN', clerkId: 'admin_clerk', email: 'admin@test.com' };
            next();
        } else if (auth === 'Bearer valid_token' || auth === 'Bearer user_token') {
            req.user = { id: 'user_1', role: 'USER', clerkId: 'user_clerk', email: 'user@test.com' };
            next();
        } else {
            res.status(401).json({ error: 'Auth failed: token not found' });
        }
    });
});

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/user', userSafeRouter);
app.use(errorHandler);

describe('User Routes', () => {

    const mockUser = {
        id: 'user_1',
        clerkId: 'test_clerk_user_123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('PATCH /api/user/:id/role', () => {
        it('should allow ADMIN to promote a user', async () => {
            // Mock the requesting user as ADMIN
            const adminUser = { ...mockUser, id: 'admin_1', role: 'ADMIN' };
            (db.user.findUnique as jest.Mock).mockResolvedValue(adminUser);

            // Mock the database update
            (db.user.update as jest.Mock).mockResolvedValue({
                id: 'user_2',
                role: 'MANAGER'
            });

            const res = await request(app)
                .patch('/api/user/user_2/role')
                .set('Authorization', 'Bearer admin_token')
                .send({ role: 'MANAGER' });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.role).toBe('MANAGER');
            expect(db.user.update).toHaveBeenCalledWith(expect.objectContaining({
                where: { id: 'user_2' },
                data: { role: 'MANAGER' }
            }));
        });

        it('should block non-ADMIN users from promoting', async () => {
            // Mock requesting user as regular USER
            (db.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

            const res = await request(app)
                .patch('/api/user/user_2/role')
                .set('Authorization', 'Bearer user_token')
                .send({ role: 'MANAGER' });

            // Expect forbidden from requireAdmin middleware
            expect(res.status).toBe(403);
            expect(res.body.message).toMatch(/Access denied/i);
        });
    });
});
