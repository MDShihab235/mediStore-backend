import express from "express";
import { medicineController } from "./medicines.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.SELLER),
  medicineController.createMedicine,
);

router.get("/", medicineController.getAllMedicines);
router.get("/:medicineId", medicineController.getMedicineById);

export const medicineRouter = router;
