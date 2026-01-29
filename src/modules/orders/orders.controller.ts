import { NextFunction, Request, Response } from "express";
import { orderService } from "./orders.service";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id; // from auth middleware
    const { items } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const order = await orderService.createOrder(userId, items);

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
export const orderController = {
  createOrder,
  getUsersOrder,
  getSingleOrderDetails,
};
