import { Request, Response, NextFunction } from "express";
import { ApiError } from "@/interface";
import status from "http-status";

/**
 * User roles in order of authority
 */
export enum UserRole {
    USER = "USER",
    MANAGER = "MANAGER",
    ADMIN = "ADMIN",
}

/**
 * Middleware to check if user has required role
 * @param allowedRoles - Array of allowed roles
 * @returns Express middleware function
 */
export const requireRole = (...allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new ApiError(status.UNAUTHORIZED, "Authentication required"));
        }

        const userRole = req.user.role as UserRole;

        if (!allowedRoles.includes(userRole)) {
            return next(
                new ApiError(
                    status.FORBIDDEN,
                    `Access denied. Required roles: ${allowedRoles.join(", ")}`
                )
            );
        }

        next();
    };
};

/**
 * Middleware to check if user has at least a specific role level
 * This checks role hierarchy: ADMIN > MANAGER > USER > VIEWER
 * @param minimumRole - Minimum required role
 * @returns Express middleware function
 */
export const requireMinimumRole = (minimumRole: UserRole) => {
    const roleHierarchy = {
        [UserRole.USER]: 1,
        [UserRole.MANAGER]: 2,
        [UserRole.ADMIN]: 3,
    };

    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new ApiError(status.UNAUTHORIZED, "Authentication required"));
        }

        const userRole = req.user.role as UserRole;
        const userRoleLevel = roleHierarchy[userRole] || 0;
        const minimumRoleLevel = roleHierarchy[minimumRole];

        if (userRoleLevel < minimumRoleLevel) {
            return next(
                new ApiError(
                    status.FORBIDDEN,
                    `Access denied. Minimum required role: ${minimumRole}`
                )
            );
        }

        next();
    };
};

/**
 * Middleware to check if user is an admin
 */
export const requireAdmin = requireRole(UserRole.ADMIN);

/**
 * Middleware to check if user is at least a manager
 */
export const requireManager = requireMinimumRole(UserRole.MANAGER);

/**
 * Middleware to check if user is at least a regular user (not just viewer)
 */
export const requireUser = requireMinimumRole(UserRole.USER);
