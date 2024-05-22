import express from "express";
import { UserControllers } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";

const router = express.Router();

router.post("/admin", UserControllers.createAdmin);
router.post("/member", UserControllers.createMember);
router.get("/profile", auth(Role.ADMIN, Role.MEMBER), UserControllers.getMyProfile);

export const UserRoutes = router;
