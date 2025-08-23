import { Router } from "express";
import UserDataController from "../controllers/userData.controller";

const router = Router();

// Count users by birth year
router.get("/users/count/birthyear", UserDataController.countByBirthYear);

// Count users by citizen
router.get("/users/count/citizen", UserDataController.countByCitizen);

// Count users by status
router.get("/users/count/status", UserDataController.countByStatus);

export default router;