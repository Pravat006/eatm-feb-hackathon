import { Router } from "express";
import { chatWithAI } from "./ai-controller";

import { aiChatLimiter } from "@/middlewares/rate-limiter";

const router = Router();

router.post("/chat", aiChatLimiter, chatWithAI);

export const aiRouter = router;
