import { Request, Response } from "express";
import { getPool } from "../config/connection";

export class UserDataController {
  // Count users by birth year
  static async countByBirthYear(req: Request, res: Response) {
    try {
      const pool = getPool();
      const query = `
        SELECT YEAR(birthdate) AS year, COUNT(*) AS count
        FROM users
        GROUP BY YEAR(birthdate)
        ORDER BY YEAR(birthdate) ASC
      `;

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

  // Count users by citizen
  static async countByCitizen(req: Request, res: Response) {
    try {
      const pool = getPool();
      const query = `
        SELECT citizen, COUNT(*) AS count
        FROM users
        GROUP BY citizen
        ORDER BY count DESC
      `;

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

  // Count users by status
  static async countByStatus(req: Request, res: Response) {
    try {
      const pool = getPool();
      const query = `
        SELECT status, COUNT(*) AS count
        FROM users
        GROUP BY status
        ORDER BY count DESC
      `;

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

export default UserDataController;
