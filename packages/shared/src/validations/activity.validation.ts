import { z } from "zod";

/**
 * Schema for activity filters
 */
export const activityFiltersSchema = z.object({
    userId: z.string().cuid().optional(),
    type: z.string().optional(),
    limit: z.coerce.number().int().positive().max(100).default(50),
    offset: z.coerce.number().int().min(0).default(0),
});

export type ActivityFilters = z.infer<typeof activityFiltersSchema>;
