import { Router } from "express";
import userRoutes from "./logs.routes.js";

const router = Router();

router.use("/", userRoutes);

export default router;
