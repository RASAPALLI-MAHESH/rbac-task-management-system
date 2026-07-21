import TaskService from "../services/TaskService.js";

const createTask = async (req, res) => {
    try {
         const {
            title,
            description,
            status,
            assignedTo,
         } = req.body;
         const createdTask = await TaskService.createTask(
            {
                title,
                description,
                status,
                assignedTo,
                createdBy: req.user?.userId,
            })
                
            res.status(201).json({
                message: "Task created successfully",
                task: createdTask,
            })
    }
    catch(error) {
            if (
                error.message === "Title is too short" ||
                error.message === "Description is too short" ||
                error.message === "Invalid user ID" ||
                error.message === "User not found" ||
                error.message === "Assigned User not found" ||
                error.message === "Invalid creator ID" ||
                error.message === "Task creator must be an admin"
            ) {
                return res.status(400).json({ message: error.message });
            }
            console.error("Error creating task:", error);
            return res.status(500).json({ message: "Internal server error" });
    }
}

const updateTask = async (req, res) => {
    const id = req.params?.id || req.body?.id;
    const { id: bodyId, ...data } = req.body;
    try{
        const updatedTask = await TaskService.UpdateTask(id, data, req.user);
        return res.status(200).json(
            {
                message: "Task updated successfully",
                task: updatedTask,
            }
        )
    }
    catch(error) {
        if(
            error.message === "Invalid task Id" ||
            error.message === "Title is too short" ||
            error.message === "Description is too short" ||
            error.message === "Invalid user ID" ||
            error.message === "Assigned User not found" ||
            error.message === "Invalid task status" ||
            error.message === "No fields to update"
        )
        {
            return res.status(400).json({ message: error.message });
        }
        if (error.message === "Admin cannot update task status") {
            return res.status(403).json({ message: error.message });
        }
        if (error.message === "Task not found") {
            return res.status(404).json({ message: error.message });
        }
        console.error("Error updating task:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
const deleteTask = async (req, res) => {
    try{
          const id = req.params?.id || req.body?.id;
          const deleteTask = await TaskService.deleteTask(id);
          return res.status(200).json(
            {
                message: "Task deleted successfully",
                task: deleteTask,
            }
          )
    }
    catch(error){
        if(error.message === "Invalid task Id" || error.message === "Invalid task ID")
        {
            return res.status(400).json({ message: error.message });
        }
        if (error.message === "Task not found") {
            return res.status(404).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}
const getTasks = async (req, res) => {
    try {
        const tasks = await TaskService.getTasks(req.user);
        return res.status(200).json({
            message: "Tasks fetched successfully",
            tasks,
        });
    }
    catch (error) {
        console.error("Error fetching tasks:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
const getTask = async (req, res) => {
    try {
        const id = req.params?.id || req.body?.id;
        const task = await TaskService.getTask(id, req.user);
        return res.status(200).json({
            message: "Task fetched successfully",
            task,
        });
    }
    catch (error) {
        if (error.message === "Invalid task ID") {
            return res.status(400).json({ message: error.message });
        }
        if (error.message === "Task not found") {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === "Forbidden task access") {
            return res.status(403).json({ message: error.message });
        }
        console.error("Error fetching task:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const updateTaskStatus = async (req, res) => {
    try {
        const id = req.params?.id || req.body?.id;
        const { status } = req.body;
        const updatedTask = await TaskService.updateTaskStatus(id, status, req.user);
        return res.status(200).json({
            message: "Task status updated successfully",
            task: updatedTask,
        });
    }
    catch (error) {
        if (
            error.message === "Invalid task ID" ||
            error.message === "Invalid task status"
        ) {
            return res.status(400).json({ message: error.message });
        }
        if (error.message === "Task not found") {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === "Only assigned user can update status") {
            return res.status(403).json({ message: error.message });
        }
        console.error("Error updating task status:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export default { createTask, updateTask, deleteTask, getTask, getTasks, updateTaskStatus };