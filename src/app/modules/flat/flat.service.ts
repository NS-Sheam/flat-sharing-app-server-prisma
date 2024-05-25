import { Flat, Prisma, Role } from "@prisma/client";
import prisma from "../../utils/prisma";

import { flatSearchableFields } from "./flat.const";
import { PaginationHelper } from "../../utils/paginationHelper";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const addFlat = async (user: JwtPayload, payload: any) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  const member = await prisma.member.findUnique({
    where: {
      userId: user.id,
    },
  });

  const result = await prisma.flat.create({
    data: {
      ...payload,
      memberId: member?.id,
    },
  });

  return result;
};

const getAllFlats = async (query: any, option: any) => {
  const { page, limit, sortBy, sortOrder, skip } = PaginationHelper.calculatePagination(option);

  const { searchTerm, rent, bedrooms, ...remainingFilters } = query;

  const andCondition: Prisma.FlatWhereInput[] = [];
  if (query.searchTerm) {
    andCondition.push({
      OR: flatSearchableFields.map((field) => ({
        [field]: {
          contains: query.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  if (query.rent) {
    andCondition.push({
      rent: {
        equals: Number(query.rent),
      },
    });
  }
  if (query.bedrooms) {
    andCondition.push({
      bedrooms: {
        equals: Number(query.bedrooms),
      },
    });
  }

  if (Object.keys(remainingFilters).length > 0) {
    andCondition.push({
      AND: Object.keys(remainingFilters).map((key) => ({
        [key]: {
          equals: remainingFilters[key],
        },
      })),
    });
  }

  const whereCondition: Prisma.FlatWhereInput = {
    AND: andCondition,
  };

  const result = await prisma.flat.findMany({
    where: whereCondition,
    include: {
      member: true,
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.flat.count({
    where: whereCondition,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleFlat = async (flatId: string) => {
  const result = await prisma.flat.findUnique({
    where: {
      id: flatId,
    },
  });

  return result;
};

const updateFlat = async (user: JwtPayload, flatId: string, payload: Partial<Flat>) => {
  const isFlatExist = await prisma.flat.findUnique({
    where: {
      id: flatId,
    },
  });

  if (!isFlatExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Flat not found");
  }

  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: {
      id: user.id,
    },
    include: {
      member: true,
      admin: true,
    },
  });

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (isUserExist.role === Role.MEMBER && isUserExist.member?.id !== isFlatExist.memberId) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not allowed to update this flat");
  }

  const result = await prisma.flat.update({
    where: {
      id: flatId,
    },
    data: payload,
  });

  return result;
};

const deleteFlat = async (user: JwtPayload, flatId: string) => {
  const isFlatExist = await prisma.flat.findUnique({
    where: {
      id: flatId,
    },
  });

  if (!isFlatExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Flat not found");
  }

  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: {
      id: user.id,
    },
    include: {
      member: true,
      admin: true,
    },
  });

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (isUserExist.role === Role.MEMBER && isUserExist.member?.id !== isFlatExist.memberId) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not allowed to delete this flat");
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.request.deleteMany({
      where: {
        flatId,
      },
    });
    const deletedFlat = await tx.flat.delete({
      where: {
        id: flatId,
      },
    });
    return deletedFlat;
  });

  return result;
};

export const FlatServices = {
  addFlat,
  getAllFlats,
  getSingleFlat,
  updateFlat,
  deleteFlat,
};
