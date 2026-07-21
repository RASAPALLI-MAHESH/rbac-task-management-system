import jwt from "jsonwebtoken";
import tokenService from "../services/tokenService.js";
const verifyToken = (req, res, next) => {
    console.log("Verifying token...");
     let token;
     const authHeader = req.headers.Authorization || req.headers.authorization;
     if(authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
     if(!token){
        return res.status(401).json({ message: "Unauthorized: No token provided" });
     }

     try{
        if (tokenService.isTokenRevoked(token)) {
            return res.status(401).json({
                message: "Token has been revoked. Please login again",
            });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        console.log("Token verified successfully for user:", decode.username);
        next();
     }
     catch( error)
     {
        console.log("Token is not valid: ", error);
        return res.status(401).json(
            {
                message: "User is not authorized to access this resource"
            }
        )
     }
    }
    else {
        return res.status(401).json(
            {
                message: "Authorization denied , try login"
            }
        )
    }
};
export default verifyToken;