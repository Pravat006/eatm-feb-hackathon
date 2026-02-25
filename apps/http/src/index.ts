import app from "@/app";
import { logger } from "@repo/logger";
import { connectPublisher, disconnectPublisher } from "@repo/redis";

import config from "@/config";

// dotenv is already loaded by @repo/env-config

const PORT = config.HTTP_PORT || 3000;
const HOST = '0.0.0.0';

const startServer = async () => {
    try {
        await connectPublisher();
        logger.info("Connected to Redis publisher");

        const server = app.listen(PORT, HOST, () => {
            logger.info(`Server is running on http://localhost:${PORT}`);
            logger.info(`Network access: http://10.85.58.209:${PORT}`);
        });

        const shutdown = async () => {
            logger.info("Shutting down gracefully...");
            await disconnectPublisher();
            server.close(() => {
                process.exit(0);
            });
        };

        process.on("SIGTERM", shutdown);
        process.on("SIGINT", shutdown);
    } catch (error) {
        logger.error("Failed to start server", error);
        process.exit(1);
    }
};

startServer();

