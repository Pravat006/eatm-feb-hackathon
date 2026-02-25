import api from "./api";
import { AssetDto } from "@repo/shared";

export const assetService = {
    getAll: async (): Promise<AssetDto[]> => {
        const response: any = await api.get("/assets"); // eslint-disable-line @typescript-eslint/no-explicit-any
        return response.data;
    },

    getHealthScore: async (): Promise<any> => { // eslint-disable-line @typescript-eslint/no-explicit-any
        const response: any = await api.get("/assets/health-score"); // eslint-disable-line @typescript-eslint/no-explicit-any
        return response.data;
    }
};
