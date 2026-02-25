import { logger } from "@repo/logger";
import client from "./client";


async function ensureConnection() {
    if (client.status !== 'ready') {
        await client.connect();
    }
}

/**
 * Set user online status
 * Stores in Redis with 30 second TTL
 *
 * @param userId - User ID
 */
export const setUserOnline = async (userId: string): Promise<void> => {
    try {
        await ensureConnection();
        await client.set(`user:${userId}:online`, '1', 'EX', 30);
        logger.debug(`[REDIS Presence] User ${userId} is now online`);
    } catch (error) {
        logger.error('[REDIS Presence] Failed to set user online', { userId, error });
        throw error;
    }
};

/**
 * Set user offline status
 * @param userId - User ID
 */
export const setUserOffline = async (userId: string): Promise<void> => {
    try {
        await ensureConnection();
        await client.del(`user:${userId}:online`);
        logger.debug(`[REDIS Presence] User ${userId} is now offline`);
    } catch (error) {
        logger.error('[REDIS Presence] Failed to set user offline', { userId, error });
        throw error;
    }
};

/**
 * Check if user is online
 * @param userId - User ID
 * @returns true if user is online, false otherwise
 */
export const isUserOnline = async (userId: string): Promise<boolean> => {
    try {
        await ensureConnection();
        const online = await client.get(`user:${userId}:online`);
        return online === '1';
    } catch (error) {
        logger.error('[REDIS Presence] Failed to check user online status', { userId, error });
        return false;
    }
};

/**
 * Get all online users
 * @returns Array of online user IDs
 */
export const getOnlineUsers = async (): Promise<string[]> => {
    try {
        await ensureConnection();

        const keys = await client.keys('user:*:online');
        // Extract user IDs from keys like "user:123:online"
        return keys
            .map(key => key.split(':')[1])
            .filter((id): id is string => id !== undefined);
    } catch (error) {
        logger.error('[REDIS Presence] Failed to get online users', { error });
        return [];
    }
};

/**
 * Heartbeat to keep user online
 * @param userId - User ID
 */
export const heartbeat = async (userId: string): Promise<void> => {
    try {
        await ensureConnection();
        // Refresh TTL to 30 seconds
        await client.expire(`user:${userId}:online`, 30);
    } catch (error) {
        logger.error('[REDIS Presence] Failed to send heartbeat', { userId, error });
        throw error;
    }
};