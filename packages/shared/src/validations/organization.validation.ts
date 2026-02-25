import { z } from "zod";

/**
 * Schema for updating an organization
 */
export const updateOrganizationSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100).optional(),
    slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens").optional(),
    logo: z.string().url("Logo must be a valid URL").optional().nullable(),
    description: z.string().max(500).optional().nullable(),
    settings: z.record(z.any()).optional().nullable(),
});

export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
