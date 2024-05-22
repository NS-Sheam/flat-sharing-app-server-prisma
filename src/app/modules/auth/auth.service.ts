import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import prisma from "../../utils/prisma";
import { jwtHelper } from "../../utils/jwtHelper";
import config from "../../../config";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";

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

export const AuthServices = {
  login,
};
