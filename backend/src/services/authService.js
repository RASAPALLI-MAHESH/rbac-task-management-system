import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import tokenService from "./tokenService.js";

const allowedRoles = ["admin", "user"];
const normalizeText = (value) => {
    if (typeof value !== "string") {
        return "";
    }
    return value.trim();
};

const validateUsername = (username) => {
    if (!username) {
        const error = new Error("Username is required");
        error.statusCode = 400;
        throw error;
    }

    if (username.length < 3 || username.length > 30) {
        const error = new Error("Username must be between 3 and 30 characters");
        error.statusCode = 400;
        throw error;
    }

    if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
        const error = new Error("Username can only contain letters, numbers, dots, underscores, and hyphens");
        error.statusCode = 400;
        throw error;
    }
};

const validatePassword = (password) => {
    if (!password) {
        const error = new Error("Password is required");
        error.statusCode = 400;
        throw error;
    }
    if (password.length < 8) {
        const error = new Error("Password must be at least 8 characters long");
        error.statusCode = 400;
        throw error;
    }
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[^a-zA-Z0-9]/.test(password)) {
        const error = new Error("Password must include uppercase, lowercase, number, and special character");
        error.statusCode = 400;
        throw error;
    }
};

const validateRole = (role) => {
    if (role && !allowedRoles.includes(role)) {
        const error = new Error(`Invalid role. Allowed roles: ${allowedRoles.join(", ")}`);
        error.statusCode = 400;
        throw error;
    }
};
const Register = async (username, password, role) => {
       const normalizedUsername = normalizeText(username);
       const normalizedPassword = typeof password === "string" ? password : "";
       const normalizedRole = normalizeText(role);

       validateUsername(normalizedUsername);
       validatePassword(normalizedPassword);
       validateRole(normalizedRole);

        const existingUser = await userModel.findOne(
            {
                username: normalizedUsername,
            }
        )
        if(existingUser) {
            const error = new Error("Username already exists");
            error.statusCode = 409;
            throw error;
        }
        try {
            const hashedPassword = await bcrypt.hash(normalizedPassword, 10);
            const newUser = await userModel.create(
                {
                    username: normalizedUsername,
                    password: hashedPassword,
                    role: normalizedRole || "user",
                }
            )
            return newUser;
        }
        catch (error) {            
            if(error.code === 11000) {
                const duplicateError = new Error("Username already exists");
                duplicateError.statusCode = 409;
                throw duplicateError;
            }
            if (error.name === "ValidationError") {
                const validationError = new Error(error.message);
                validationError.statusCode = 400;
                throw validationError;
            }
        throw error;
        }
}
const Login = async (username , password) => {
    const normalizedUsername = normalizeText(username);
    const normalizedPassword = typeof password === "string" ? password : "";

    if(!normalizedUsername || !normalizedPassword){
        const error = new Error("Username and password are required");
        error.statusCode = 400;
        throw error;
    }

    if (process.env.JWT_SECRET === undefined || process.env.JWT_SECRET === "") {
        const error = new Error("JWT secret is not configured");
        error.statusCode = 500;
        throw error;
    }

        const user = await userModel.findOne({ username: normalizedUsername });
        if(!user) {
            const error = new Error("Invalid username");
            error.statusCode = 401;
            throw error;
        }

        if (!user.password) {
            const error = new Error("User password is missing");
            error.statusCode = 500;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(normalizedPassword , user.password);
        if(!isPasswordValid) {
            const error = new Error("Invalid password");
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign(
            {
                userId: user._id,
                username: user.username,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "12h"
            }
        )
        return { username: user.username, role: user.role, token };
}

const DeleteAccount = async (user, id) => {
    if (!user || !user.userId || !user.role) {
        const error = new Error("Unauthorized request");
        error.statusCode = 401;
        throw error;
    }

    const deletionId = id || user.userId;

    if (!mongoose.Types.ObjectId.isValid(deletionId)) {
        const error = new Error("Invalid user ID");
        error.statusCode = 400;
        throw error;
    }

    if (user.role !== "admin" && deletionId !== user.userId) {
        const error = new Error("You can only delete your own account");
        error.statusCode = 403;
        throw error;
    }

    const account = await userModel.findById(deletionId);
    if (!account) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    const deletedUser = await userModel.findByIdAndDelete(deletionId);
    return deletedUser;
};

const Logout = async (token) => {
    if (!token || typeof token !== "string") {
        const error = new Error("Token is required");
        error.statusCode = 400;
        throw error;
    }

    tokenService.revokeToken(token);
    return { message: "Logout successful" };
};

export default { Register , Login, DeleteAccount, Logout};