import express from "express";
const router = express.Router();
import authRouter from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import taskRouter from "./taskRoute.js";

router.use("/auth", authRouter);
router.use("/users", userRoutes);
router.use("/tasks", taskRouter);

export default router;
