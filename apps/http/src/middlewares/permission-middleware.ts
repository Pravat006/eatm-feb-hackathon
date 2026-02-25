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
    SUPER_ADMIN = "SUPER_ADMIN",
}

/**
 * Middleware to check if user has required role
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
 * Role hierarchy: SUPER_ADMIN > ADMIN > MANAGER > USER
 */
const roleHierarchy: Record<string, number> = {
    [UserRole.USER]: 1,
    [UserRole.MANAGER]: 2,
    [UserRole.ADMIN]: 3,
    [UserRole.SUPER_ADMIN]: 4,
};

export const requireMinimumRole = (minimumRole: UserRole) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new ApiError(status.UNAUTHORIZED, "Authentication required"));
        }

        const userRole = req.user.role as UserRole;
        const userRoleLevel = roleHierarchy[userRole] || 0;
        const minimumRoleLevel = roleHierarchy[minimumRole] ?? 0;

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

/** Only SUPER_ADMIN — platform-wide operations */
export const requireSuperAdmin = requireRole(UserRole.SUPER_ADMIN);

/** ADMIN or SUPER_ADMIN — campus-level admin operations */
export const requireAdmin = requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN);

/** MANAGER or above */
export const requireManager = requireMinimumRole(UserRole.MANAGER);

/** Any authenticated user */
export const requireUser = requireMinimumRole(UserRole.USER);
