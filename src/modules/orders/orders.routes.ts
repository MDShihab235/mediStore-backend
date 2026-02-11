import { Router } from "express";
import { orderController } from "./orders.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = Router();

router.post("/", orderController.createOrder);

router.get(
  "/seller/orders",
  auth(UserRole.CUSTOMER, UserRole.SELLER, UserRole.ADMIN),
  orderController.getSellerOrders,
);
router.get("/:medicineId/stock", orderController.getMedicineStock);

router.post("/cart/validate", orderController.validateCart);
router.patch("/order/:id/cancel", orderController.cancelOrder);

router.get(
  "/:userId",
  auth(UserRole.CUSTOMER, UserRole.SELLER, UserRole.ADMIN),
  orderController.getUsersOrder,
);
router.get(
  "/order/:id",
  auth(UserRole.CUSTOMER, UserRole.SELLER, UserRole.ADMIN),
  orderController.getSingleOrderDetails,
);
export const ordersRouter = router;
