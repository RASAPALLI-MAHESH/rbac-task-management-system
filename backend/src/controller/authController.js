import authService from "../services/authService.js";
const register = async (req , res) => {
    const { username , password , role} = req.body;
    try { 
        const RegisterUser = await authService.Register(username , password , role);
        res.status(201).json(
            {
                message: "User registered successfully",
                user: {
                    id: RegisterUser._id,
                    username: RegisterUser.username,
                    role: RegisterUser.role,
                }
            }
        )
    }
        catch (error) {
            console.error("Error during registration:", error);
           res.status(error.statusCode || 500).json(
            {
                message: error.message || "Internal server error"
            }
           )
        }
}
const login = async (req , res) => {
    try {
    const { username , password} = req.body;
    if(!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    const loginUser = await authService.Login(username , password);
        res.status(200).json(
            {
                message: "User logged in suceessfully",
                user: loginUser.username,
                role: loginUser.role,
                token: loginUser.token
            }
         )
    }
    catch (error) {
        console.error("Error during login:", error);
        res.status(error.statusCode || 500).json(
            {
                message: error.message || "Internal server error"
            }
        )
    }
}

const deleteAccount = async (req, res) => {
    try {
        const id = req.params?.id;
        const user = await authService.DeleteAccount(req.user, id);

        return res.status(200).json({
            message: "Account deleted successfully",
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
            }
        });
    }
    catch (error) {
        console.error("Error during account deletion:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error"
        });
    }
}

const logout = async (req, res) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : "";
        await authService.Logout(token);

        return res.status(200).json({
            message: "Logout successful"
        });
    }
    catch (error) {
        console.error("Error during logout:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error"
        });
    }
}

export {register , login, deleteAccount, logout};