import { Request, Response } from "express";
import { getPool } from "../config/connection";
import { User } from "../models/User.model";

export class UserController {
  // Create new user
  static async createUser(req: Request, res: Response) {
    try {
      const user: User = req.body;
      const pool = getPool();

      // SQL query as const
      const query = `
        INSERT INTO users
          (firstname, middlename, lastname, birthdate, citizen, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      // Define a small inline type for the INSERT result
      type InsertResult = { insertId: number };

      const [result] = await pool.query(query, [
        user.firstname,
        user.middlename ?? null,
        user.lastname,
        user.birthdate,
        user.citizen,
        user.status,
      ]) as [InsertResult, any];

      res.status(201).json({
        message: "User created successfully"
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Unknown error" });
      }
    }
  }

  // Get all users
  static async getAllUsers(req: Request, res: Response) {
    try {
      const pool = getPool();
      const query = "SELECT * FROM users";

      const [rows] = await pool.query(query);
      res.status(200).json(rows);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Unknown error" });
      }
    }
  }
}

export default UserController;