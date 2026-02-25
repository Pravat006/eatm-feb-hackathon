import api from "../axios";
import {
    LoginInput,
    RegisterInput,
} from "@repo/shared";
import { AuthResponse } from "./user.service";

export class AuthService {
    static async login(data: LoginInput): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>("/auth/login", data);
        return response.data;
    }

    static async register(data: RegisterInput): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>("/auth/register", data);
        return response.data;
    }

    static async logout(): Promise<void> {
        await api.post("/auth/logout");
    }

    static async refreshTokens(): Promise<void> {
        await api.post("/auth/refresh-tokens");
    }
}
