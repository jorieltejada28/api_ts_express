import { Request, Response, NextFunction } from "express";
import { UserController } from "../controllers/user.controller";

export const redirectToHashId = async (req: Request, res: Response, next: NextFunction) => {
  const numericId = Number(req.params.id);

  if (!isNaN(numericId)) {
    const hashId = UserController.hashId(numericId);
    return res.redirect(`/api/user/${hashId}`);
  }

  next();
};
