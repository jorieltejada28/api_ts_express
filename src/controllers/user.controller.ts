import { Request, Response } from "express";
import { getPool } from "../config/connection";
import { User } from "../models/User.model";
import { RowDataPacket } from "mysql2";
import jwt, { SignOptions } from "jsonwebtoken";

interface UserPayload {
  id: number;
}

export class UserController {
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

      const secret = process.env.JWT_SECRET as string;
      const expiresIn = (process.env.JWT_EXPIRES as SignOptions["expiresIn"]) || "1h";

      // Replace user.id with JWT token
      const users = rows.map((user: any) => {
        const payload: UserPayload = { id: user.id };
        return {
          ...user,
          id: jwt.sign(payload, secret, { expiresIn }),
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

  static async getUserById(req: Request, res: Response) {
    try {
      const pool = getPool();
      const userId = parseInt(req.params.id);

      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const query = "SELECT * FROM users WHERE id = ?";
      const [rows] = await pool.query<User[] & RowDataPacket[]>(query, [userId]);

      if (rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(rows[0]);
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