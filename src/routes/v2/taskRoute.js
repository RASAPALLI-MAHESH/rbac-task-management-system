import express from "express";
import verifyToken from "../../middleware/authMiddleware.js";
import taskController from "../../controller/taskController.js";
import userMiddelware from "../../middleware/UserMiddleware.js";

const authorizeRole = userMiddelware;
const taskRouter = express.Router();

taskRouter.post("/create", verifyToken, authorizeRole("admin"), taskController.createTask);
taskRouter.delete("/delete/:id", verifyToken, authorizeRole("admin"), taskController.deleteTask);
taskRouter.put("/update/:id", verifyToken, authorizeRole("admin"), taskController.updateTask);

// Both admin and user can read tasks.
taskRouter.get("/getTasks", verifyToken, authorizeRole("admin", "user"), taskController.getTasks);
taskRouter.get("/getTask/:id", verifyToken, authorizeRole("admin", "user"), taskController.getTask);

// Only user can update status for assigned tasks.
taskRouter.patch("/updateStatus/:id", verifyToken, authorizeRole("user"), taskController.updateTaskStatus);

export default taskRouter;
