import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import prisma from "../../utils/prisma";
import { jwtHelper } from "../../utils/jwtHelper";
import config from "../../../config";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";

const login = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email,
    },
  });

  const isPasswordCorrect = await bcrypt.compare(password, user?.password);

  if (!isPasswordCorrect) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password.");
  }
  const accessToken = jwtHelper.generateToken(
    {
      id: user.id,
      email,
      role: user.role,
    },
    config.jwt_access_secret as string,
    config.jwt_access_expiration as string
  );

  return {
    accessToken,
  };
};

const changePassword = async (user: JwtPayload, payload: { oldPassword: string; newPassword: string }) => {
  const { oldPassword, newPassword } = payload;

  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      id: user.id,
    },
  });

  const isPasswordCorrect = await bcrypt.compare(oldPassword, userInfo.password);

  if (!isPasswordCorrect) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid old password.");
  }

  const hashedPassword = await bcrypt.hash(newPassword, Number(config.bcrypt_salt));

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  return {
    success: true,
    message: "Password changed successfully",
  };
};

export const AuthServices = {
  login,
  changePassword,
};
