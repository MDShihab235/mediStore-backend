import { NextFunction, Request, Response } from "express";
import { usersService } from "./users.service";

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await usersService.getAllUsers();

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

export const usersController = {
  getAllUsers,
};
