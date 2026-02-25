import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { logger, httpLogger } from '@repo/logger';
import router from './routes';
import path from 'path';
import { errorHandler, apiLimiter, notFound } from '@/middlewares';
import status from 'http-status';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';

import config from "@/config";

const app: Application = express();
// Handle BigInt serialization
(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

httpLogger(app);

const corsOrigins = config.CORS_ORIGIN ? config.CORS_ORIGIN.split(',') : ["http://localhost:3000", "http://127.0.0.1:3000"];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (corsOrigins.indexOf(origin) !== -1 || corsOrigins.includes("*")) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    logger.error('Unhandled error:', {
        error: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        ip: req.ip
    });

    res.status(500).json({
        message: config.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
});
app.use('/static', express.static(path.join(process.cwd(), 'public')));

app.use(express.urlencoded({ extended: true }));

// Swagger docs
app.use('/api/v0/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/v0/docs.json', (_req: Request, res: Response) => {
    res.status(status.OK).json(swaggerSpec);
});

app.get("/", (req: Request, res: Response) => {

    logger.info("HEALTH CHECK HIT")
    return res.status(status.OK).json({
        message: "health check hit from backend"
    })
})
app.use("/api/v0", apiLimiter, router);

app.use(notFound)
app.use(errorHandler)

export default app