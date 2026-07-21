import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import sanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import cors from "cors";
import indexRouterversion1 from "./routes/v1/index.js";
import indexRouterversion2 from "./routes/v2/index.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
const app = express();
//protect header
app.use(helmet());
//allow frontend origin for browser requests
app.use(
    cors({
        origin: ["http://localhost:5173", "http://localhost:5174"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);
//sanitize the app data
app.use(sanitize());
//prevent xss html injections
app.use(xss());
//prevent csp attacks
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"]
        }
    })
);
//middleware
app.use(express.json());

//swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//routes
app.use("/api/v1", indexRouterversion1);
app.use("/api/v2", indexRouterversion2);
export default app;
