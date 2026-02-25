import { Router } from "express";
import { getProfile, promoteUser, joinCampus } from "./user-controller";
import authMiddleware from "@/middlewares/auth-middleware";
import { requireAdmin } from "@/middlewares/permission-middleware";

const router = Router();

// All user routes require authentication
router.use(authMiddleware);


router.get("/profile", getProfile);

// Admin-only role assignment
router.patch("/:id/role", requireAdmin, promoteUser);

// User joins a campus
router.put("/campus", joinCampus);

export const userSafeRouter: Router = router;
