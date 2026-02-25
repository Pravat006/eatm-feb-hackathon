import { Router } from "express";
import { authStatus, logout } from "./auth-controller";
import authMiddleware from "@/middlewares/auth-middleware";

const router = Router();

// Health check — confirms Clerk auth is the mechanism
router.get("/status", authStatus);

// Optional: clear any server-side session state (Clerk sessions are frontend-managed)
router.post("/logout", authMiddleware, logout);

export const authRouter: Router = router;