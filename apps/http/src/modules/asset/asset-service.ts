import db from "@/services/db";
import { publish } from "@repo/redis";
import { logger } from "@repo/logger";
import { WsNotificationDto } from "@repo/shared";

class AssetService {
    async createAsset(data: any) {
        return await db.asset.create({ data });
    }

    async getAssets() {
        return await db.asset.findMany({
            orderBy: { failureRisk: "desc" },
        });
    }

    async updateAssetRisk(id: string, failureRisk: number) {
        const asset = await db.asset.update({
            where: { id },
            data: { failureRisk, lastMaintenance: new Date() },
        });

        const notification: WsNotificationDto = {
            type: "ASSET_RISK_UPDATED",
            assetId: asset.id,
            name: asset.name,
            failureRisk: asset.failureRisk,
            userId: "ADMIN",
        };
        publish("system:notifications", notification).catch(err => logger.error("Failed to publish asset risk update", err));

        return asset;
    }

    async getHealthScore() {
        const assets = await db.asset.findMany();

        if (assets.length === 0) {
            return { score: 100, status: "OPTIMAL", assetCount: 0 };
        }

        const averageRisk = assets.reduce((acc, curr) => acc + curr.failureRisk, 0) / assets.length;
        const score = Math.max(0, Math.min(100, 100 - (averageRisk * 100)));

        let healthStatus = "OPTIMAL";
        if (score < 80) healthStatus = "WARNING";
        if (score < 50) healthStatus = "CRITICAL";

        return {
            score: Math.round(score),
            status: healthStatus,
            assetCount: assets.length
        };
    }
}

export default new AssetService();
