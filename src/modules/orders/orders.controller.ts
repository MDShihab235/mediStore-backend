import { NextFunction, Request, Response } from "express";
import { orderService } from "./orders.service";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id; // from auth middleware
    const { items, shippingAddress } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const order = await orderService.createOrder(
      userId,
      items,
      shippingAddress,
    );

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

const getUsersOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id; // from auth middleware

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const orders = await orderService.getUsersOrder(userId);

    res.status(200).json({
      success: true,
      message: "User orders fetched successfully",
      data: orders,
    });
  } catch (err) {
    next(err);
  }
};

const getSingleOrderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const { id: orderId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const order = await orderService.getSingleOrderDetails(
      orderId as string,
      userId,
    );

    res.status(200).json({
      success: true,
      message: "Order details fetched successfully",
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

const getSellerOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sellerId = req.user?.id;
    const role = req.user?.role;

    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Optional but recommended
    if (role !== "SELLER" && role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Seller and Admin only.",
      });
    }

    const orders = await orderService.getSellerOrders(sellerId);

    res.status(200).json({
      success: true,
      message: "all orders fetched successfully",
      data: orders,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/medicines/:id/stock
const getMedicineStock = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const medicine = await orderService.getMedicineStock(id as string);

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.json({ stock: medicine.stock });
  } catch (err) {
    next(err);
  }
};

const validateCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { items } = req.body;

    const result = await orderService.validateCartStock(items);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { id: orderId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const order = await orderService.cancelOrder(orderId as string, userId);

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

export const orderController = {
  createOrder,
  getUsersOrder,
  getSingleOrderDetails,
  getSellerOrders,
  getMedicineStock,
  validateCart,
  cancelOrder,
};
