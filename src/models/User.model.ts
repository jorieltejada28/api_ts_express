export interface User {
  id?: number;            // optional, auto-increment in DB
  firstname: string;
  middlename?: string;
  lastname: string;
  birthdate: Date;
  citizen: string;
  status: string;
}

// UserModel now only defines types, no DB logic
export class UserModel {}
