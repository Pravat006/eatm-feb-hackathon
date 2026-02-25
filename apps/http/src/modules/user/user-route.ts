import { Router } from "express";
import { getMe, getProfile, promoteUser } from "./user-controller";
import authMiddleware from "@/middlewares/auth-middleware";
import { requireAdmin } from "@/middlewares/permission-middleware";

const router = Router();

// All user routes require authentication
router.use(authMiddleware);

router.get("/me", getMe);
router.get("/profile", getProfile);

// Admin-only role assignment
router.patch("/:id/role", requireAdmin, promoteUser);

export const userSafeRouter: Router = router;
