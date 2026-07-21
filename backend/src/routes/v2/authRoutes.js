import express from "express";
const Router = express.Router();
import verifyToken from "../../middleware/authMiddleware.js";
import userMiddelware from "../../middleware/UserMiddleware.js";
import { register, login, deleteAccount, logout } from "../../controller/authController.js";

Router.post("/register", register);
Router.post("/login", login);
Router.post("/logout", verifyToken, userMiddelware("admin", "user"), logout);
Router.delete("/delete-account/:id?", verifyToken, userMiddelware("admin", "user"), deleteAccount);

export default Router;
