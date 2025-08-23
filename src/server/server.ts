import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import userRoutes from "../routes/user.route";

const app = express();

// Middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api", userRoutes);

export default app;
