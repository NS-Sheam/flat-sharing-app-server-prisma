import { NextFunction, Request, Response } from "express";
import { ZodError, ZodIssue } from "zod";
import { TErrorDetails } from "../interface/error";

const globalErrorResponse = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.status || 500;
  let message = err.message || "Internal server error";
  let errorDetails: TErrorDetails = err;

  if (err instanceof ZodError) {
    const messageRegex = /"message":\s*"([^"]+)"/g;
    const matches = message.match(messageRegex);
    if (matches) {
      message = matches
        .map((match: string) => {
          return match.replace(/"message":\s*"/g, "").replace(/"/g, "");
        })
        .join(". ");
    }

    errorDetails = {
      issues: err.issues.map((issue: ZodIssue) => {
        return {
          field: issue?.path[issue.path.length - 1],
          message: issue.message,
        };
      }),
    };
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails,
  });
};

export default globalErrorResponse;
