import express from "express";
import verifyToken from "../../middleware/authMiddleware.js";
import userMiddelware from "../../middleware/UserMiddleware.js";
import userController from "../../controller/userController.js";

const userRouter = express.Router();

userRouter.get("/getUsers", verifyToken, userMiddelware("admin"), userController.getUsers);

export default userRouter;
