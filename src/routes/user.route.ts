import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const router = Router();

// Create a new user
router.post("/user", UserController.createUser);
// Get all users
router.get("/users", UserController.getAllUsers);

export default router;
