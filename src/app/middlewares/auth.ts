import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import config from "../../config";
import { Role } from "@prisma/client";
import prisma from "../utils/prisma";
const auth = (...roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized.");
      }

      const decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;

      if (!decoded) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized.");
      }
      const isUserActive = await prisma.user.findUnique({
        where: {
          id: decoded.id,
        },
      });

      if (!isUserActive) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User not found.");
      }

      if (roles.length && !roles.includes(decoded.role)) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not allowed to access this route.");
      }

      req.user = decoded;
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
