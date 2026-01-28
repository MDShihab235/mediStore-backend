import express from "express";
import { medicineController } from "./medicines.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SELLER),
  medicineController.createMedicine,
);

router.get("/", medicineController.getAllMedicines);
router.get("/:medicineId", medicineController.getMedicineById);

router.put(
  "/:medicineId",
  auth(UserRole.SELLER, UserRole.ADMIN),
  medicineController.updateMedicine,
);

export const medicineRouter = router;
