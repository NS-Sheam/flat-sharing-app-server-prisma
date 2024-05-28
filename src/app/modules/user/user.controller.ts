import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";

import { UserServices } from "./user.service";
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import pick from "../../utils/pick";

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
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filteredQuery = pick(req.query, ["searchTerm", "role"]);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await UserServices.getAllUsers(filteredQuery, options);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All users fetched successfully",
    meta: result?.meta,
    data: result?.data,
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
const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isActive } = req.body;
  const result = await UserServices.updateUserStatus(id, isActive);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User status updated successfully",
    data: result,
  });
});

export const UserControllers = {
  createAdmin,
  createMember,
  getAllUsers,
  getMyProfile,
  updateUserInfo,
  updateUserStatus,
};
