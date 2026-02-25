import { Router } from "express";
import authMiddleware from "@/middlewares/auth-middleware";
import { validateRequest } from "@/middlewares";
import { registerCampusSchema, reviewCampusSchema, inviteStaffSchema } from "./campus-validation";
import { registerCampus, getPendingCampuses, reviewCampusRequest, getActiveCampuses, inviteStaff, getCampusMembers } from "./campus-controller";

const router = Router();


router.get("/active", getActiveCampuses);

// All routes below require authentication
router.use(authMiddleware);

// Organization creation flow (Campus Manager)
router.post("/register", validateRequest(registerCampusSchema), registerCampus);

// Super Admin provisioning actions
router.get("/pending", getPendingCampuses);
router.patch("/:id/review", validateRequest(reviewCampusSchema), reviewCampusRequest);

// Organization Admin actions
router.post("/invite", validateRequest(inviteStaffSchema), inviteStaff);
router.get("/members", getCampusMembers);


export const campusRouter = router;
