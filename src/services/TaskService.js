import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import taskModel from "../models/taskModel.js";
const createTask = async (data) => {
    if(!data.title || data.title.trim().length < 5 ) {
        throw new Error("Title is too short");
    }
    if(!data.description || data.description.trim().length < 8) {
        throw new Error("Description is too short");
    }

    let assignedTo = null;
    if (data.assignedTo) {
        if(!mongoose.Types.ObjectId.isValid(data.assignedTo)) {
            throw new Error("Invalid user ID");
        }

        const existingUser = await userModel.findById(data.assignedTo);
        if(!existingUser) {
            throw new Error("Assigned User not found");
        }

        assignedTo = data.assignedTo;
    }

    let createdBy = null;
    if (data.createdBy) {
        if (!mongoose.Types.ObjectId.isValid(data.createdBy)) {
            throw new Error("Invalid creator ID");
        }

        const creator = await userModel.findById(data.createdBy);
        if (!creator || creator.role !== "admin") {
            throw new Error("Task creator must be an admin");
        }

        createdBy = data.createdBy;
    }

    const task = await taskModel.create(
        {
            title: data.title,
            description: data.description,
            status: data.status || "pending",
            assignedTo,
            createdBy,
        });
    return task;
}
const deleteTask = async (id) => {
    if(!mongoose.Types.ObjectId.isValid(id))
    {
        throw new Error("Invalid task ID");
    }
    const task = await taskModel.findByIdAndDelete(id);
    if(!task)
    {
        throw new Error("Task not found");
    }
    return task;
}
const UpdateTask = async(id, data, user) => {
    if(!mongoose.Types.ObjectId.isValid(id))
    {
        throw new Error("Invalid task Id");
    }

    if(data.title !== undefined && data.title.trim().length < 5 ) {
        throw new Error("Title is too short");
    }

    if(data.description && data.description.trim().length < 8) {
        throw new Error("Description is too short");
    }

    if (data.assignedTo !== undefined && data.assignedTo !== null && data.assignedTo !== "") {
        if (!mongoose.Types.ObjectId.isValid(data.assignedTo)) {
            throw new Error("Invalid user ID");
        }

        const existingUser = await userModel.findById(data.assignedTo);
        if (!existingUser) {
            throw new Error("Assigned User not found");
        }
    }

    if (data.assignedTo === "") {
        data.assignedTo = null;
    }

    if (data.status !== undefined) {
        if (user?.role === "admin") {
            throw new Error("Admin cannot update task status");
        }

        const allowedStatus = ["pending", "in progress", "completed"];
        if (!allowedStatus.includes(data.status)) {
            throw new Error("Invalid task status");
        }
    }

    if (Object.keys(data).length === 0) {
        throw new Error("No fields to update");
    }

    const updatedtask = await taskModel.findByIdAndUpdate(id, data, { new: true });
    if(!updatedtask)
    {
        throw new Error("Task not found");
    }
    return updatedtask;
}

const getTasks = async (user) => {
    if (user.role === "admin") {
        return taskModel
            .find()
            .populate("assignedTo", "username role")
            .populate("createdBy", "username role")
            .sort({ createdAt: -1 });
    }
    return taskModel
        .find({ assignedTo: user.userId })
        .populate("assignedTo", "username role")
        .populate("createdBy", "username role")
        .sort({ createdAt: -1 });
}

const getTask = async (id, user) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid task ID");
    }

    const task = await taskModel
        .findById(id)
        .populate("assignedTo", "username role")
        .populate("createdBy", "username role");
    if (!task) {
        throw new Error("Task not found");
    }

    if (user.role !== "admin" && (!task.assignedTo || task.assignedTo._id.toString() !== user.userId)) {
        throw new Error("Forbidden task access");
    }
    return task;
}

const updateTaskStatus = async (id, status, user) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid task ID");
    }

    const allowedStatus = ["pending", "in progress", "completed"];
    if (!allowedStatus.includes(status)) {
        throw new Error("Invalid task status");
    }

    const task = await taskModel.findById(id);
    if (!task) {
        throw new Error("Task not found");
    }

    if (!task.assignedTo || task.assignedTo.toString() !== user.userId) {
        throw new Error("Only assigned user can update status");
    }

    task.status = status;
    await task.save();
    return task;
}

export default { createTask, deleteTask, UpdateTask, getTasks, getTask, updateTaskStatus};