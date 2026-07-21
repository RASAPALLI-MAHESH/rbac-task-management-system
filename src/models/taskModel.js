import mongoose from "mongoose";
const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        status: {
            type : String,
            enum : ["pending", "in progress", "completed"],
            default: "pending",
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        dueDate: {
            type: Date,
        }
    },
     {timestamps: true}
)
export default mongoose.model("Task", taskSchema);