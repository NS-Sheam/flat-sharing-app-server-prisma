import express from "express";
import { UserControllers } from "./user.controller";

import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";

const router = express.Router();

router.post("/admin", UserControllers.createAdmin);
router.post("/member", UserControllers.createMember);
router.get("/", UserControllers.getAllUsers);
router.get("/profile", auth(Role.ADMIN, Role.MEMBER), UserControllers.getMyProfile);
router.patch("/:id/status", auth(Role.ADMIN), UserControllers.updateUserStatus);
router.patch("/", auth(Role.ADMIN, Role.MEMBER), UserControllers.updateUserInfo);

export const UserRoutes = router;
