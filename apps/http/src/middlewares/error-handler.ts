import { Request, Response, NextFunction } from 'express';
import { handleCastError, handleDuplicateError } from '@/errors';
import { ApiResponse } from '@/interface';
import status from 'http-status';
import { ZodError } from 'zod';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // Handle Zod validation errors
    if (err instanceof ZodError) {
        const validationErrors = err.errors.map(error => ({
            field: error.path.join('.'),
            message: error.message,
        }));

        return res.status(status.BAD_REQUEST).json(
            new ApiResponse(
                status.BAD_REQUEST,
                'Validation failed',
                { errors: validationErrors }
            )
        );
    }

    // Handle Prisma/Mongoose cast errors
    if (err.name === 'CastError') err = handleCastError(err);

    // Handle duplicate key errors
    if (err.code === 11000) err = handleDuplicateError(err);

    // Return error response
    res.status(err.statusCode || status.INTERNAL_SERVER_ERROR).json(
        new ApiResponse(
            err.statusCode || status.INTERNAL_SERVER_ERROR,
            err.message || 'Internal Server Error',
            undefined,
            err.context
        )
    );
    return;
};