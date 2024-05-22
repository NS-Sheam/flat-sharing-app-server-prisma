import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { FlatServices } from "./flat.service";
import pick from "../../utils/pick";
import { flatFilterableFields } from "./flat.const";

const addFlat = catchAsync(async (req: Request, res: Response) => {
  const result = await FlatServices.addFlat(req.user, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Flat added successfully",
    data: result,
  });
});
const getAllFlats = catchAsync(async (req: Request, res: Response) => {
  const filteredQuery = pick(req.query, flatFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await FlatServices.getAllFlats(filteredQuery, options);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Flat retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleFlat = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await FlatServices.getSingleFlat(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Flat retrieved successfully",
    data: result,
  });
});

const updateFlat = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await FlatServices.updateFlat(req.user, id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Flat information updated successfully",
    data: result,
  });
});

const deleteFlat = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await FlatServices.deleteFlat(req.user, id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Flat deleted successfully",
    data: result,
  });
});

export const FlatController = {
  addFlat,
  getAllFlats,
  getSingleFlat,
  updateFlat,
  deleteFlat,
};
