import { z } from "zod";

export const createAssetSchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.string().min(1, "Type is required"),
    location: z.string().min(1, "Location is required"),
    failureRisk: z.number().min(0).max(1).optional(),
});

export const updateAssetRiskSchema = z.object({
    failureRisk: z.number().min(0).max(1),
});
