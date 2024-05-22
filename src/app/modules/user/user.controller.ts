import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";

import { UserServices } from "./user.service";
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.createAdmin(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User registered successfully",
    data: result,
  });
});
const createMember = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.createMember(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User registered successfully",
    data: result,
  });
});
const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user;
  const result = await UserServices.getMyProfile(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User profile retrieved successfully",
    data: result,
  });
});

const updateUserInfo = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.updateUserInfo(req.user, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User information updated successfully",
    data: result,
  });
});

export const UserControllers = {
  createAdmin,
  createMember,
  getMyProfile,
  updateUserInfo,
};
