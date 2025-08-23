import { Request, Response } from "express";
import { UserModel, User } from "../models/User.model";

export class UserController {
  // Create new user
  static async createUser(req: Request, res: Response) {
    try {
      const user: User = req.body;
      const result = await UserModel.create(user);
      res.status(201).json({ message: "User created successfully", id: result.insertId });
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
      const users = await UserModel.findAll();
      res.status(200).json(users);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Unknown error" });
      }
    }
  }
}
