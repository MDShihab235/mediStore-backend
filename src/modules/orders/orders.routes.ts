import { Router } from "express";
import { orderController } from "./orders.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = Router();

router.post("/", auth(UserRole.SELLER), orderController.createOrder);
router.get("/:userId", auth(UserRole.SELLER), orderController.getUsersOrder);
router.get(
  "/single/:orderId",
  auth(UserRole.SELLER),
  orderController.getSingleOrderDetails,
);

export const ordersRouter = router;
