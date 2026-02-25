import { z } from "zod";
import { AlertTypeEnum, AlertSeverityEnum } from "../constants";

// Re-export enums for convenience
export { AlertTypeEnum, AlertSeverityEnum };

/**
 * Schema for creating an alert
 */
export const createAlertSchema = z.object({
    shipmentId: z.string().cuid().optional(),
    type: AlertTypeEnum,
    severity: AlertSeverityEnum,
    title: z.string().min(3, "Title must be at least 3 characters").max(200),
    message: z.string().min(10, "Message must be at least 10 characters").max(1000),
    data: z.record(z.any()).optional().nullable(),
});

/**
 * Schema for alert filters
 */
export const alertFiltersSchema = z.object({
    isRead: z.coerce.boolean().optional(),
    type: AlertTypeEnum.optional(),
    severity: AlertSeverityEnum.optional(),
    shipmentId: z.string().cuid().optional(),
    limit: z.coerce.number().int().positive().max(100).default(50),
    offset: z.coerce.number().int().min(0).default(0),
});

export type CreateAlertInput = z.infer<typeof createAlertSchema>;
export type AlertFilters = z.infer<typeof alertFiltersSchema>;
