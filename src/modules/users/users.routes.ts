import { Router } from "express";
import { usersController } from "./users.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = Router();

router.get(
  "/",
  auth(UserRole.SELLER, UserRole.ADMIN),
  usersController.getAllUsers,
);

export const usersRouter = router;
