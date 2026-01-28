import { NextFunction, Request, Response } from "express";
import { medicineService } from "./medicines.service";

const createMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: "Unauthorized!",
      });
    }
    const result = await medicineService.createMedicine(
      req.body,
      user.id as string,
    );
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const medicineController = {
  createMedicine,
};
