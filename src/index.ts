import dotenv from "dotenv";
import { connectDB } from "./config/connection";
import app from "./server/server";

dotenv.config();

const PORT = process.env.PORT || 3000;

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
    process.exit(1);
  }
}

startServer();