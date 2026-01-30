import { Router } from "express";
import { orderController } from "./orders.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = Router();

router.post("/", auth(UserRole.SELLER), orderController.createOrder);
router.get("/:userId", auth(UserRole.SELLER), orderController.getUsersOrder);

router.get(
  "/order/:id",
  auth(UserRole.SELLER),
  orderController.getSingleOrderDetails,
);
router.get(
  "/seller/orders",
  auth(UserRole.SELLER),
  orderController.getSellerOrders,
);
export const ordersRouter = router;
