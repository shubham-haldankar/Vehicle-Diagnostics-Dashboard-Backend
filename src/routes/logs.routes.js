import { Router } from "express";
import { getLogs } from "../controllers/logs.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/logs", authMiddleware, getLogs);

export default router;
