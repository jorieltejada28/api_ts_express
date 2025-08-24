import { Router } from "express";
import UserController from "../controllers/user.controller";

const router = Router();

// Create a new user
router.post("/users", UserController.createUser);

// Get all users
router.get("/users", UserController.getAllUsers);

// Get a user by id
router.get("/user/:id", UserController.getUserById);

// Update a user by id
router.put("/user/:id", UserController.updateUser);

// Delete a user by id
router.delete("/user/:id", UserController.deleteUser);

export default router;
