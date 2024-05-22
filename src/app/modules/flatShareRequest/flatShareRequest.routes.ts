import express from "express";
import { FlatShareRequestController } from "./flatShareRequest.controller";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";

const router = express.Router();

router.post("/:id", auth(Role.MEMBER), FlatShareRequestController.addFlatShareRequest);

router.get("/", auth(Role.ADMIN), FlatShareRequestController.getAllFlatShareRequests);
router.get("/:id", auth(), FlatShareRequestController.getFlatShareRequestById);
router.patch("/status/:id", auth(Role.ADMIN), FlatShareRequestController.updateFlatShareRequestStatus);
router.delete("/:id", auth(Role.ADMIN), FlatShareRequestController.deleteFlatShareRequest);

export const FlatShareRequestRoutes = router;
