import { Router } from "express";
import { orderController } from "./orders.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = Router();

router.post(
  "/",
  auth(UserRole.CUSTOMER, UserRole.SELLER, UserRole.ADMIN),
  orderController.createOrder,
);
router.get(
  "/:userId",
  auth(UserRole.CUSTOMER, UserRole.SELLER, UserRole.ADMIN),
  orderController.getUsersOrder,
);

router.get(
  "/order/:id",
  auth(UserRole.SELLER, UserRole.ADMIN, UserRole.CUSTOMER),
  orderController.getSingleOrderDetails,
);
router.get(
  "/seller/orders",
  auth(UserRole.SELLER, UserRole.ADMIN),
  orderController.getSellerOrders,
);
router.get("/:medicineId/stock", orderController.getMedicineStock);

router.post(
  "/cart/validate",
  auth(UserRole.CUSTOMER, UserRole.SELLER, UserRole.ADMIN),
  orderController.validateCart,
);
router.patch(
  "/order/:id/cancel",
  auth(UserRole.CUSTOMER, UserRole.SELLER, UserRole.ADMIN),
  orderController.cancelOrder,
);

export const ordersRouter = router;
