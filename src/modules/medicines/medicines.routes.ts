import express from "express";
import { medicineController } from "./medicines.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

//Public routes
router.get("/", medicineController.getAllMedicines);
router.get("/:medicineId", medicineController.getMedicineById);

//Private Routes
router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SELLER),
  medicineController.createMedicine,
);
router.put(
  "/:medicineId",
  auth(UserRole.SELLER, UserRole.ADMIN),
  medicineController.updateMedicine,
);
router.delete(
  "/:medicineId",
  auth(UserRole.SELLER, UserRole.ADMIN),
  medicineController.deleteMedicine,
);

export const medicineRouter = router;
