import { logger } from '@repo/logger';

// Redis client is managed by @repo/redis package
// No need to create a separate client here

export const connectRedis = async () => {
    try {
        // Redis connection is handled automatically by @repo/redis
        logger.info('Redis setup complete (using @repo/redis)');
    } catch (error) {
        logger.error('Failed to setup Redis:', error);
        process.exit(1);
    }
};
