import mysql, { Pool } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let pool: Pool | null = null;

export const connectDB = async () => {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST as string,
      user: process.env.DB_USER as string,
      password: process.env.DB_PASSWORD as string,
      database: process.env.DB_NAME as string,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  try {
    const connection = await pool.getConnection();
    console.log("MySQL connected successfully");
    connection.release();
    return pool;
  } catch (error) {
    console.error("MySQL connection failed:", error);
    throw error;
  }
};
