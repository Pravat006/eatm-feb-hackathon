import { Socket } from 'socket.io';
import { createClerkClient } from '@clerk/clerk-sdk-node';
import db from '@/config/db';
import { logger } from '@repo/logger';
import { config } from '@repo/env-config';
import {
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData,
    SocketUser
} from '@repo/shared';

const clerkClient = createClerkClient({ secretKey: (config as any).CLERK_SECRET_KEY });

export type AuthenticatedSocket = Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>;

export const authenticateSocket = async (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
    try {
        // Clerk usually sends token in auth object or headers
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return next(new Error('Authentication token not provided'));
        }

        // Verify Clerk Token
        const sessionClaims = await clerkClient.verifyToken(token);

        if (!sessionClaims) {
            return next(new Error('Invalid or expired Clerk token'));
        }

        const clerkId = sessionClaims.sub as string;

        // Sync user with DB
        let user = await db.user.findUnique({
            where: { clerkId },
        });

        if (!user) {
            // Auto-provision user if they exist in Clerk but not our DB
            const clerkUser = await clerkClient.users.getUser(clerkId);
            user = await db.user.create({
                data: {
                    clerkId,
                    email: clerkUser.emailAddresses[0]?.emailAddress || 'unknown@campus.edu',
                    name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
                    role: 'USER',
                }
            });
        }

        // Attach user to socket data
        socket.data.userId = user.id;
        socket.data.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role as any // Type cast to bypass strict enum checks for now
        };

        logger.debug(`User ${user.name} (${user.role}) authenticated on socket ${socket.id}`);
        next();
    } catch (error) {
        logger.error('Socket Clerk authentication error:', error);
        next(new Error('Authentication failed'));
    }
};
