import express from "express";
const Router = express.Router();
import verifyToken from "../../middleware/authMiddleware.js";
import userMiddelware from "../../middleware/UserMiddleware.js";
import { register , login, deleteAccount, logout } from "../../controller/authController.js";

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     description: Create a new account with hashed password using bcrypt.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRequest'
 *           examples:
 *             registerUser:
 *               value:
 *                 username: "mahesh"
 *                 password: "Mahesh@123"
 *                 role: "user"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden role assignment
 *       500:
 *         description: Internal server error
 */
Router.post("/register", register);

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login user
 *     description: Authenticate credentials and return JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid request payload
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
Router.post("/login", login);
Router.post("/logout", verifyToken, userMiddelware("admin", "user"), logout);
Router.delete("/delete-account/:id?", verifyToken, userMiddelware("admin", "user"), deleteAccount);

export default Router;
