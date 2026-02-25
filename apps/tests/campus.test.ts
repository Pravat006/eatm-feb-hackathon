import request from 'supertest';
import express from 'express';
import { campusRouter } from '@/modules/campus/campus-route';
import { errorHandler } from '@/middlewares';
import db from '@repo/db';
import cookieParser from 'cookie-parser';

jest.mock('@repo/db');

// Mock auth middleware for different roles
let mockUserRole = 'USER';
let mockUserId = 'user123';
jest.mock('@/middlewares/auth-middleware', () => {
    return {
        __esModule: true,
        default: (req: any, res: any, next: any) => {
            req.user = { id: mockUserId, role: mockUserRole, email: 'test@example.com' };
            next();
        }
    };
});

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/campus', campusRouter);
app.use(errorHandler);

describe('Campus Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUserRole = 'USER';
        mockUserId = 'user123';
    });

    describe('POST /api/campus/register', () => {
        it('should allow a user to register a new campus', async () => {
            const newCampus = { id: 'c1', name: 'Tech College', type: 'COLLEGE', status: 'PENDING' };
            (db.campus.create as jest.Mock).mockResolvedValueOnce(newCampus);
            (db.user.update as jest.Mock).mockResolvedValueOnce({ id: mockUserId, role: 'ADMIN', campusId: 'c1' });

            const res = await request(app)
                .post('/api/campus/register')
                .send({ name: 'Tech College', type: 'COLLEGE', contactEmail: 'admin@tech.edu' });

            expect(res.status).toBe(201);
            expect(res.body.message).toMatch(/submitted successfully/i);
            expect(res.body.data.name).toBe('Tech College');
            expect(db.campus.create).toHaveBeenCalled();
            expect(db.user.update).toHaveBeenCalledWith({
                where: { id: mockUserId },
                data: { campusId: 'c1', role: 'ADMIN' }
            });
        });
    });

    describe('GET /api/campus/pending', () => {
        it('should block non-super-admins from viewing pending campuses', async () => {
            mockUserRole = 'ADMIN';

            const res = await request(app).get('/api/campus/pending');
            expect(res.status).toBe(403);
            expect(res.body.message).toMatch(/Only Super Admins/i);
        });

        it('should allow SUPER_ADMIN to view pending campuses', async () => {
            mockUserRole = 'SUPER_ADMIN';
            (db.campus.findMany as jest.Mock).mockResolvedValueOnce([{ id: 'c1', name: 'Tech College' }]);

            const res = await request(app).get('/api/campus/pending');
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBe(1);
        });
    });

    describe('PATCH /api/campus/:id/review', () => {
        it('should block non-super-admins from approving campuses', async () => {
            mockUserRole = 'ADMIN';

            const res = await request(app)
                .patch('/api/campus/c1/review')
                .send({ action: 'APPROVE' });

            expect(res.status).toBe(403);
            expect(db.campus.update).not.toHaveBeenCalled();
        });

        it('should allow SUPER_ADMIN to approve a campus', async () => {
            mockUserRole = 'SUPER_ADMIN';
            (db.campus.update as jest.Mock).mockResolvedValueOnce({ id: 'c1', status: 'ACTIVE' });

            const res = await request(app)
                .patch('/api/campus/c1/review')
                .send({ action: 'APPROVE' });

            expect(res.status).toBe(200);
            expect(res.body.data.status).toBe('ACTIVE');
            expect(db.campus.update).toHaveBeenCalledWith({
                where: { id: 'c1' },
                data: { status: 'ACTIVE' }
            });
        });

        it('should allow SUPER_ADMIN to reject a campus', async () => {
            mockUserRole = 'SUPER_ADMIN';
            (db.campus.update as jest.Mock).mockResolvedValueOnce({ id: 'c1', status: 'REJECTED' });

            const res = await request(app)
                .patch('/api/campus/c1/review')
                .send({ action: 'REJECT' });

            expect(res.status).toBe(200);
            expect(res.body.data.status).toBe('REJECTED');
        });
    });

    describe('GET /api/campus/active', () => {
        // Mock the auth middleware completely since it's a public route in design, but testing the express chain
        it('should return a list of active campuses', async () => {
            (db.campus.findMany as jest.Mock).mockResolvedValueOnce([
                { id: 'c1', name: 'Active College', type: 'COLLEGE' }
            ]);

            const res = await request(app).get('/api/campus/active');

            expect(res.status).toBe(200);
            expect(res.body.data.length).toBe(1);
            expect(res.body.data[0].name).toBe('Active College');
        });
    });
});
