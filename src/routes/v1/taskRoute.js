import express from "express";
import verifyToken from "../../middleware/authMiddleware.js";
import taskController from "../../controller/taskController.js";
import userMiddelware from "../../middleware/UserMiddleware.js";
const authorizeRole = userMiddelware;
const taskRouter = express.Router();

/**
 * @openapi
 * /api/v1/tasks:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Get all tasks
 *     description: Fetch tasks for authenticated user. Admin can fetch all tasks.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Tasks fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Tasks fetched successfully"
 *               tasks:
 *                 - id: "661a0b16e8f4d7560f3d2ca1"
 *                   title: "Fix API validation"
 *                   description: "Update status code responses"
 *                   status: "pending"
 *                   createdAt: "2026-04-24T12:00:00.000Z"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 *   post:
 *     tags:
 *       - Tasks
 *     summary: Create a task
 *     description: Create task. In this project only admin can create tasks.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 5
 *               description:
 *                 type: string
 *                 minLength: 8
 *               status:
 *                 type: string
 *                 enum: [pending, completed]
 *               assignedTo:
 *                 type: string
 *           examples:
 *             createTask:
 *               value:
 *                 title: "Fix API validation"
 *                 description: "Update status code responses"
 *                 status: "pending"
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
taskRouter.get("/", verifyToken, authorizeRole("admin", "user"), taskController.getTasks);
taskRouter.post("/", verifyToken, authorizeRole("admin"), taskController.createTask);

/**
 * @openapi
 * /api/v1/tasks/{id}:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Get task by id
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task fetched successfully
 *       400:
 *         description: Invalid task id
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 *   put:
 *     tags:
 *       - Tasks
 *     summary: Update task by id
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 5
 *               description:
 *                 type: string
 *                 minLength: 8
 *               assignedTo:
 *                 type: string
 *           examples:
 *             updateTask:
 *               value:
 *                 title: "Fix API validation updated"
 *                 description: "Update 404 and 403 mappings"
 *                 status: "pending"
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 *   delete:
 *     tags:
 *       - Tasks
 *     summary: Delete task by id
 *     description: Admin only endpoint.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       400:
 *         description: Invalid task id
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
taskRouter.get("/:id([0-9a-fA-F]{24})", verifyToken, authorizeRole("admin", "user"), taskController.getTask);
taskRouter.put("/:id([0-9a-fA-F]{24})", verifyToken, authorizeRole("admin"), taskController.updateTask);
taskRouter.delete("/:id([0-9a-fA-F]{24})", verifyToken, authorizeRole("admin"), taskController.deleteTask);

// Legacy endpoints kept for current frontend compatibility.
taskRouter.post("/create", verifyToken, authorizeRole("admin"), taskController.createTask);
taskRouter.delete("/delete/:id", verifyToken, authorizeRole("admin"), taskController.deleteTask);
taskRouter.put("/update/:id", verifyToken, authorizeRole("admin"), taskController.updateTask);
taskRouter.get("/getTasks", verifyToken, authorizeRole("admin", "user"), taskController.getTasks);
taskRouter.get("/getTask/:id", verifyToken, authorizeRole("admin", "user"), taskController.getTask);

// User-only status update endpoint.
taskRouter.patch("/updateStatus/:id", verifyToken, authorizeRole("user"), taskController.updateTaskStatus);

export default taskRouter;