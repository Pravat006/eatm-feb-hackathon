import request from 'supertest';
import express from 'express';
import { assetRouter } from '@/modules/asset/asset-route';
import { errorHandler } from '@/middlewares';
import db from '@repo/db';
import * as redis from '@repo/redis';
import cookieParser from 'cookie-parser';

jest.mock('@repo/db');
jest.mock('@repo/redis');
jest.mock('@/middlewares/auth-middleware', () => {
    return jest.fn((req, res, next) => {
        const auth = req.headers.authorization;
        if (auth === 'Bearer manager_token') {
            req.user = { id: 'manager_1', role: 'MANAGER', clerkId: 'manager_clerk', email: 'manager@test.com' };
            next();
        } else {
            req.user = { id: 'user_1', role: 'USER', clerkId: 'user_clerk', email: 'user@test.com' };
            next(); // Assets /health-score allows any user
        }
    });
});

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/assets', assetRouter);
app.use(errorHandler);

describe('Asset Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/assets/health-score', () => {
        it('should calculate health score correctly', async () => {
            (db.asset.findMany as jest.Mock).mockResolvedValue([
                { failureRisk: 0.1 },
                { failureRisk: 0.3 }
            ]);

            const res = await request(app)
                .get('/api/assets/health-score')
                .set('Authorization', 'Bearer user_token');

            expect(res.status).toBe(200);
            expect(res.body.data.score).toBe(80); // (1 - 0.2) * 100
        });
    });

    describe('PATCH /api/assets/:id/risk', () => {
        it('should update asset risk and notify admin', async () => {
            const mockAsset = { id: 'asset_1', name: 'Generator', failureRisk: 0.8 };
            (db.asset.update as jest.Mock).mockResolvedValue(mockAsset);

            const res = await request(app)
                .patch('/api/assets/asset_1/risk')
                .set('Authorization', 'Bearer manager_token')
                .send({ failureRisk: 0.8 });

            expect(res.status).toBe(200);
            expect(res.body.data.failureRisk).toBe(0.8);

            // Verify Redis publishing
            expect(redis.publish).toHaveBeenCalledWith(
                'system:notifications',
                expect.objectContaining({ type: 'ASSET_RISK_UPDATED', failureRisk: 0.8 })
            );
        });
    });
});
