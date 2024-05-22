import express from "express";
import { FlatController } from "./flat.controller";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";

const router = express.Router();

router.get(
  "/",

  FlatController.getAllFlats
);

router.post("/", auth(Role.MEMBER), FlatController.addFlat);

router.patch("/:id", auth(Role.MEMBER, Role.ADMIN), FlatController.updateFlat);

router.delete("/:id", auth(Role.MEMBER, Role.ADMIN), FlatController.deleteFlat);

export const FlatRoutes = router;
