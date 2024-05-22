import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API not found",
    errorDetails: {
      path: req.originalUrl,
      message: "Your requested API is not found",
    },
  });
};

export default notFound;
