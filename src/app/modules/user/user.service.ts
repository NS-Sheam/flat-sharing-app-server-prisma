import httpStatus from "http-status";
import config from "../../../config";
import AppError from "../../errors/AppError";
import prisma from "../../utils/prisma";

import bcrypt from "bcrypt";
import { Role, Flat } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";

const createAdmin = async (payload: any) => {
  const { password, admin } = payload;
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: admin.email,
    },
  });
  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exists");
  }
  const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt));
  const result = await prisma.$transaction(async (tx) => {
    const createUser = await tx.user.create({
      data: {
        userName: admin.userName,
        email: admin.email,
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });
    const createAdmin = await tx.admin.create({
      data: {
        userId: createUser.id,
        name: admin.name,
        email: admin.email,
        mobileNo: admin.mobileNo,
        address: admin.address,
      },
    });
    return createAdmin;
  });
  return result;
};

const createMember = async (payload: any) => {
  const { password, member } = payload;
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: member.email,
    },
  });
  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exists");
  }
  const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt));
  const result = await prisma.$transaction(async (tx) => {
    const createUser = await tx.user.create({
      data: {
        userName: member.userName,
        email: member.email,
        password: hashedPassword,
        role: Role.MEMBER,
      },
    });
    const createMember = await tx.member.create({
      data: {
        userId: createUser.id,
        name: member.name,
        email: member.email,
        mobileNo: member.mobileNo,
        address: member.address,
        image: member?.image,
      },
    });
    return createMember;
  });
  return result;
};

const updateUserInfo = async (user: JwtPayload, payload: any) => {
  const { userName, email, ...remaining } = payload;
  const isUserExist = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  const result = await prisma.$transaction(async (tx) => {
    if (email) {
      await tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          email,
        },
      });
      isUserExist?.role === Role.ADMIN
        ? await tx.admin.update({
            where: {
              userId: user.id,
            },
            data: {
              email,
            },
          })
        : await tx.member.update({
            where: {
              userId: user.id,
            },
            data: {
              email,
            },
          });
    }
    if (userName) {
      await tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          userName,
        },
      });
    }
    if (remaining) {
      isUserExist?.role === Role.ADMIN
        ? await tx.admin.update({
            where: {
              userId: user.id,
            },
            data: {
              name: remaining?.name,
              mobileNo: remaining?.mobileNo,
              address: remaining?.address,
            },
          })
        : await tx.member.update({
            where: {
              userId: user.id,
            },
            data: {
              name: remaining?.name,
              mobileNo: remaining?.mobileNo,
              address: remaining?.address,
            },
          });
    }
    const updatedUser = await tx.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        userName: true,
        email: true,
        role: true,
        admin: true,
        member: true,
      },
    });
    if (!updatedUser) {
      throw new AppError(httpStatus.NOT_FOUND, "User Update failed");
    }
    return updatedUser;
  });

  return result;
};

const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: {
      id: true,
      userName: true,
      email: true,
      role: true,
      admin: true,
      member: {
        include: {
          flat: true,
        },
      },
    },
  });

  return user;
};

export const UserServices = {
  createAdmin,
  createMember,
  getMyProfile,
  updateUserInfo,
};
