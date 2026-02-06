import express from "express";
import { medicineController } from "./medicines.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

//Public routes
router.get("/", medicineController.getAllMedicines);
router.get("/:medicineId", medicineController.getMedicineById);
router.get("/categories/all", medicineController.getAllCategories);

//Private Routes
router.post(
  "/",
  auth(UserRole.SELLER, UserRole.ADMIN),
  medicineController.createMedicine,
);
router.put("/:medicineId", medicineController.updateMedicine);
router.delete(
  "/:medicineId",
  auth(UserRole.SELLER, UserRole.ADMIN),
  medicineController.deleteMedicine,
);

export const medicineRouter = router;
