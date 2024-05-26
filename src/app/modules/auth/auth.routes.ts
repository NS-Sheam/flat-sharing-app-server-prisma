import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";
import { AuthController } from "./auth.controller";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";

const router = express.Router();

router.post("/login", validateRequest(AuthValidation.loginValidationSchema), AuthController.login);
router.post(
  "/change-password",
  auth(Role.MEMBER, Role.ADMIN),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthController.changePassword
);

export const AuthRoutes = router;
