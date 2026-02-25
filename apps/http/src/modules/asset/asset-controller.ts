import { Request, Response } from "express";
import { asyncHandler } from "@/utils/async-handler";
import { createAssetSchema, updateAssetRiskSchema } from "./asset-validation";
import assetService from "./asset-service";

export const createAsset = asyncHandler(async (req: Request, res: Response) => {
    const data = createAssetSchema.parse(req.body);
    const asset = await assetService.createAsset(data);
    res.status(201).json({ success: true, data: asset });
});

export const getAssets = asyncHandler(async (req: Request, res: Response) => {
    const assets = await assetService.getAssets();
    res.status(200).json({ success: true, data: assets });
});

export const updateAssetRisk = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { failureRisk } = updateAssetRiskSchema.parse(req.body);

    const asset = await assetService.updateAssetRisk(id as string, failureRisk);

    res.status(200).json({ success: true, data: asset });
});

export const getHealthScore = asyncHandler(async (req: Request, res: Response) => {
    const healthData = await assetService.getHealthScore();
    res.status(200).json({ success: true, data: healthData });
});
