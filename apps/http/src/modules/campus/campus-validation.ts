import { z } from "zod";
import { CampusType } from "@repo/shared";

export const registerCampusSchema = z.object({
    name: z.string().min(2, "Name is required"),
    type: z.nativeEnum(CampusType, { errorMap: () => ({ message: "Invalid campus type" }) }),
    contactEmail: z.string().email("Invalid email"),
});

export const reviewCampusSchema = z.object({
    action: z.enum(["APPROVE", "REJECT"], { errorMap: () => ({ message: "Action must be APPROVE or REJECT" }) }),
});
