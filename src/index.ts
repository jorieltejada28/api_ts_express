import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./config/connection";
import userRoutes from "./routes/user.route"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api", userRoutes); // All user routes under /api

// Start Server
async function startServer() {
  try {
    // Connect to DB first
    await connectDB();

    // Start server after DB is connected
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log("Database connected successfully");
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to connect to the database:", error.message);
    } else {
      console.error("Failed to connect to the database:", error);
    }
    process.exit(1); // exit app if DB fails
  }
}

startServer();
