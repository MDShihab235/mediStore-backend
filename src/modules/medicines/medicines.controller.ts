import { NextFunction, Request, Response } from "express";
import { medicineService } from "./medicines.service";
import paginationSortingHelper from "../../helpers/paginationSortingHelpers";
import { UserRole } from "../../middlewares/auth";

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

const getAllMedicines = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { search, category, manufacturer, minPrice, maxPrice } = req.query;

    const searchString = typeof search === "string" ? search : undefined;

    const categoryString = typeof category === "string" ? category : undefined;

    const manufacturerString =
      typeof manufacturer === "string" ? manufacturer : undefined;

    const minPriceNumber =
      typeof minPrice === "string" ? Number(minPrice) : undefined;

    const maxPriceNumber =
      typeof maxPrice === "string" ? Number(maxPrice) : undefined;

    const authorId =
      typeof req.query.authorId === "string" ? req.query.authorId : undefined;

    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query,
    );

    const result = await medicineService.getAllMedicines({
      search: searchString,
      category: categoryString,
      manufacturer: manufacturerString,
      minPrice: minPriceNumber,
      maxPrice: maxPriceNumber,
      authorId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (err) {
    next(err);
  }
};

const getMedicineById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { medicineId } = req.params;
    if (!medicineId || typeof medicineId !== "string") {
      throw new Error("Medicine Id is required!!!");
    }
    const result = await medicineService.getMedicineById(medicineId);
    res.status(200).json({
      success: true,
      result,
    });
  } catch (err) {
    next(err);
  }
};

const updateMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("You are unauthorized!");
    }
    const { medicineId } = req.params;
    const isAuthorized =
      user.role === UserRole.ADMIN || user.role === UserRole.SELLER;
    const result = await medicineService.updateMedicine(
      medicineId as string,
      req.body,
      user.id,
      isAuthorized,
    );
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const deleteMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("You are unauthorized!");
    }
    const { medicineId } = req.params;
    const isAuthorized =
      user.role === UserRole.ADMIN || user.role === UserRole.SELLER;
    const result = await medicineService.deleteMedicine(
      medicineId as string,
      user.id,
      isAuthorized,
    );
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const medicineController = {
  createMedicine,
  getAllMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
};
