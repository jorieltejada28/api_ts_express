import { getPool } from "../config/connection";
import { OkPacket } from "mysql2"; 

export interface User {
  id: number;
  firstname: string;
  middlename?: string;
  lastname: string;
  birthdate: Date;
  citizen: string;
  status: string;
}

export class UserModel {
  static async create(user: User): Promise<OkPacket> {
    const pool = getPool();

    const [result] = await pool.query(
      "INSERT INTO users (firstname, middlename, lastname, birthdate, citizen, status) VALUES (?, ?, ?, ?, ?, ?)",
      [
        user.firstname,
        user.middlename ?? null,
        user.lastname,
        user.birthdate,
        user.citizen,
        user.status,
      ]
    );

    // Cast result to OkPacket so TypeScript knows it has insertId
    return result as OkPacket;
  }

  static async findAll(): Promise<User[]> {
    const pool = getPool();
    const [rows] = await pool.query("SELECT * FROM users");
    return rows as User[];
  }
}
