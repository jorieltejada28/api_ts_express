import { Request, Response } from "express";
import { getPool } from "../config/connection";
import { User } from "../models/User.model";
import { RowDataPacket } from "mysql2";
import crypto from "crypto";

export class UserController {

  private static hashId(id: number): string {
    return crypto
      .createHash("sha256")
      .update(id.toString())
      .digest("hex")
      .substring(0, 32); 
  }

  // Create new user
  static async createUser(req: Request, res: Response) {
    try {
      const user: User = req.body;
      const pool = getPool();

      const query = `
        INSERT INTO users
          (firstname, middlename, lastname, birthdate, citizen, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

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
        message: "User created successfully",
        id: result.insertId
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
  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const pool = getPool();
      const query = "SELECT * FROM users";

      const [rows] = await pool.query<RowDataPacket[]>(query);

      // Replace user.id with hashed id
      const users = rows.map((user: any) => {
        return {
          ...user,
          id: UserController.hashId(user.id),
        };
      });

      res.status(200).json(users);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Unknown error" });
      }
    }
  }

  // Get user by ID
  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const pool = getPool();
      const { id } = req.params;

      const query = "SELECT * FROM users WHERE id = ?";
      const [rows] = await pool.query<RowDataPacket[]>(query, [id]);

      if (rows.length === 0) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const user = rows[0];

      res.status(200).json({
        ...user,
        id: UserController.hashId(user.id),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Unknown error" });
      }
    }
  }
  // Update a user by id
  static async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user: Partial<User> = req.body; // Partial allows updating some fields
      const pool = getPool();

      const query = `
        UPDATE users
        SET firstname = ?, middlename = ?, lastname = ?, birthdate = ?, citizen = ?, status = ?
        WHERE id = ?
      `;

      type UpdateResult = { affectedRows: number };
      const [result] = await pool.query(query, [
        user.firstname,
        user.middlename ?? null,
        user.lastname,
        user.birthdate,
        user.citizen,
        user.status,
        id
      ]) as [UpdateResult, any];

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "User updated successfully" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Unknown error" });
      }
    }
  }

  // Delete a user by id
  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const pool = getPool();

      const query = "DELETE FROM users WHERE id = ?";

      type DeleteResult = { affectedRows: number };
      const [result] = await pool.query(query, [id]) as [DeleteResult, any];

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "User deleted successfully" });
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