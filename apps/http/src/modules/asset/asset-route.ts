import { Router } from "express";
import { createAsset, getAssets, updateAssetRisk, getHealthScore } from "./asset-controller";
import authMiddleware from "@/middlewares/auth-middleware";
import { requireAdmin, requireManager, requireUser } from "@/middlewares/permission-middleware";

const assetRouter = Router();

assetRouter.use(authMiddleware);

assetRouter.get("/", requireManager, getAssets);
assetRouter.get("/health-score", requireUser, getHealthScore);
assetRouter.post("/", requireAdmin, createAsset);
assetRouter.patch("/:id/risk", requireManager, updateAssetRisk);

export { assetRouter };
