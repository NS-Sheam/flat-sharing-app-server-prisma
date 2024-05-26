import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";
import { AuthController } from "./auth.controller";

const router = express.Router();

router.post("/login", validateRequest(AuthValidation.loginValidationSchema), AuthController.login);
router.post(
  "/change-password",
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthController.changePassword
);

export const AuthRoutes = router;
