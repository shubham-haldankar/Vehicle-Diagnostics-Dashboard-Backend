import { Router } from "express";
import { getLogs } from "../controllers/logs.controller.js";

const router = Router();

router.get("/logs", getLogs);

export default router;
