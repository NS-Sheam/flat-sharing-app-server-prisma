import { Response } from "express";

const sendResponse = <T>(
  res: Response,
  data: {
    success: boolean;
    statusCode: number;
    message: string;
    meta?: {
      total: number;
      page: number;
      limit: number;
    };
    data: T;
  }
) => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    meta: data?.meta || null || undefined,
    data: data?.data || null || undefined,
  });
};
export default sendResponse;
