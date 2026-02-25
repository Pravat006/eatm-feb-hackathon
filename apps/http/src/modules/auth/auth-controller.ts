import { asyncHandler } from "@/utils/async-handler";
import { ApiResponse } from "@/interface/api-response";
import { generateTokens, verifyRefreshToken } from "@/utils/jwt";
import db from "@/services/db";
import status from "http-status";
import bcrypt from "bcryptjs";
import { ApiError } from "@/interface";
import { loginSchema, registerSchema } from "./validations";
import { CookieOptions } from "express";
import config from "@/config";

// Cookie options
const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
};

const accessTokenOptions: CookieOptions = {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 minutes
};

const refreshTokenOptions: CookieOptions = {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/**
 * Register a new user
 */
export const register = asyncHandler(async (req, res) => {
    const { name, username, email, password } = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await db.user.findFirst({
        where: {
            OR: [
                { email },
                username ? { username } : undefined
            ].filter(Boolean) as any
        }
    });

    if (existingUser) {
        throw new ApiError(status.CONFLICT, "User with this email or username already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (Mocking for legacy, in reality Clerk does this)
    const user = await db.user.create({
        data: {
            name,
            email,
            clerkId: `legacy_${Date.now()}`,
            role: 'USER',
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        }
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user as any);

    // Set cookies
    res.cookie('accessToken', accessToken, accessTokenOptions);
    res.cookie('refreshToken', refreshToken, refreshTokenOptions);

    return res
        .status(status.CREATED)
        .json(new ApiResponse(status.CREATED, "User registered successfully", {
            user,
        }));
});

/**
 * User login with email and password
 */
export const login = asyncHandler(async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);

    const user = await db.user.findUnique({
        where: { email },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        }
    });

    if (!user) {
        throw new ApiError(status.UNAUTHORIZED, "Invalid credentials");
    }

    // Exclude password from response (Legacy check removed for new schema)
    const userData = user;

    return res
        .status(status.OK)
        .json(new ApiResponse(status.OK, "User logged in successfully", {
            user: userData,
        }));
});

/**
 * Logout
 */
export const logout = asyncHandler(async (req, res) => {
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);

    return res
        .status(status.OK)
        .json(new ApiResponse(status.OK, "Logged out successfully"));
});

/**
 * Refresh access token using refresh token
 */
export const refreshTokens = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken || req.headers.authorization?.replace('Bearer ', '');

    if (!refreshToken) {
        throw new ApiError(status.BAD_REQUEST, "Refresh token not provided");
    }

    const decodedToken = verifyRefreshToken(refreshToken);

    if (!decodedToken) {
        throw new ApiError(status.UNAUTHORIZED, "Invalid or expired refresh token");
    }

    if (!decodedToken.id) {
        throw new ApiError(status.UNAUTHORIZED, "Invalid refresh token");
    }

    const user = await db.user.findUnique({
        where: { id: decodedToken.id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        }
    });

    if (!user) {
        throw new ApiError(status.UNAUTHORIZED, "Invalid or expired refresh token");
    }

    // Generate new tokens
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(user as any);

    // Set cookies
    res.cookie('accessToken', newAccessToken, accessTokenOptions);
    res.cookie('refreshToken', newRefreshToken, refreshTokenOptions);

    return res
        .status(status.OK)
        .json(new ApiResponse(status.OK, "Tokens refreshed successfully"));
});
