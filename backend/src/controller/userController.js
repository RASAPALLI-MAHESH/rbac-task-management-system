import userModel from "../models/userModel.js";

const getUsers = async (req, res) => {
    try {
        const users = await userModel
            .find({ role: "user" }, { password: 0 })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Users fetched successfully",
            users,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export default { getUsers };