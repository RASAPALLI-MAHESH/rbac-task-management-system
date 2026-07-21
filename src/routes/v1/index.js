import express from "express";
const router = express.Router();
import authRouter from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import taskRouter from "./taskRoute.js";
//routes to access auth and user routes
router.use("/auth", authRouter);
router.use("/users", userRoutes);

//task routes
router.use("/tasks", taskRouter);

export default router;