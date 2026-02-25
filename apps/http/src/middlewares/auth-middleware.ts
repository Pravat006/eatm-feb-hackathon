import { ApiError } from "@/interface";
import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { createClerkClient } from "@clerk/clerk-sdk-node";
import db from "@/services/db";
import { logger } from "@repo/logger";
import config from "@/config";

const clerkClient = createClerkClient({ secretKey: (config as any).CLERK_SECRET_KEY });

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = req.cookies?.__session; // Clerk session cookie name

        if (!token) {
            const authHeader = req.headers?.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.replace('Bearer ', '');
            }
        }

        if (!token) {
            return next(
                new ApiError(status.UNAUTHORIZED, "Authentication token not found", "Auth Middleware")
            );
        }

        const sessionClaims = await clerkClient.verifyToken(token);

        if (!sessionClaims) {
            return next(
                new ApiError(status.UNAUTHORIZED, "Invalid or expired session", "AUTH MIDDLEWARE")
            );
        }

        const clerkId = sessionClaims.sub as string;

        let user = await db.user.findUnique({
            where: { clerkId },
            select: {
                id: true,
                clerkId: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        // Auto-provision user if they exist in Clerk but not in our DB
        if (!user) {
            const clerkUser = await clerkClient.users.getUser(clerkId);
            const primaryEmail = clerkUser.emailAddresses[0]?.emailAddress;

            if (!primaryEmail) {
                return next(new ApiError(status.UNAUTHORIZED, "Clerk user has no email", "AUTH MIDDLEWARE"));
            }

            user = await db.user.create({
                data: {
                    clerkId,
                    email: primaryEmail,
                    name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
                    role: 'USER',
                }
            });
        }

        req.user = user as any;
        next();

    } catch (error) {
        logger.error('Error in auth middleware:', error);
        return next(
            new ApiError(status.UNAUTHORIZED, "Invalid or expired token", "AUTH MIDDLEWARE")
        );
    }
};

export default authMiddleware;