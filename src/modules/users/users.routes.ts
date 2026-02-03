import { Router } from "express";
import { usersController } from "./users.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = Router();

router.get("/", usersController.getAllUsers);
router.get("/:id", usersController.getUser);
router.patch("/:userId/status", usersController.banOrUnbanUser);
router.patch("/:userId/role", usersController.changeUserRole);
export const usersRouter = router;
