import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { FlatShareRequestServices } from "./flatShareRequest.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import pick from "../../utils/pick";
import { flatShareRequestFilterableFields } from "./flatShareRequest.const";

const addFlatShareRequest = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await FlatShareRequestServices.addFlatShareRequest(req.user, id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Flat request added successfully",
    data: result,
  });
});

const getAllFlatShareRequests = catchAsync(async (req: Request, res: Response) => {
  const filteredQuery = pick(req.query, flatShareRequestFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await FlatShareRequestServices.getAllFlatShareRequests(filteredQuery, options);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All flat requests fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getFlatShareRequestById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await FlatShareRequestServices.getFlatShareRequestById(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Flat request fetched successfully",
    data: result,
  });
});

const updateFlatShareRequestStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await FlatShareRequestServices.updateFlatShareRequestStatus(id, status);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Flat request status updated",
    data: result,
  });
});

const deleteFlatShareRequest = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await FlatShareRequestServices.deleteFlatShareRequest(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Flat request deleted successfully",
    data: result,
  });
});

export const FlatShareRequestController = {
  addFlatShareRequest,
  getAllFlatShareRequests,
  getFlatShareRequestById,
  updateFlatShareRequestStatus,
  deleteFlatShareRequest,
};
