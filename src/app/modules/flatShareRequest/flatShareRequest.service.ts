import { Prisma, Request, Role, Status } from "@prisma/client";
import prisma from "../../utils/prisma";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { PaginationHelper } from "../../utils/paginationHelper";
import { flatShareRequestSearchableFields } from "./flatShareRequest.const";

const addFlatShareRequest = async (user: JwtPayload, flatId: string, payload: any) => {
  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: {
      id: user.id,
    },
    include: {
      member: true,
    },
  });

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  const isFlatExist = await prisma.flat.findUnique({
    where: {
      id: flatId,
    },
  });

  if (!isFlatExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Flat not found");
  }

  const isAlreadyRequested = await prisma.request.findFirst({
    where: {
      flatId,
      memberId: isUserExist.member?.id,
    },
  });

  if (isAlreadyRequested) {
    throw new AppError(httpStatus.BAD_REQUEST, "You have already requested this flat");
  }

  if (isUserExist.role === Role.MEMBER && isUserExist.member?.id === isFlatExist.memberId) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not allowed to request this flat");
  }

  const result = await prisma.request.create({
    data: {
      flatId,
      memberId: isUserExist.member?.id,
      ...payload,
    },
  });

  return result;
};

const getAllFlatShareRequests = async (query: Record<string, unknown>, option: any) => {
  const { page, limit, sortBy, sortOrder, skip } = PaginationHelper.calculatePagination(option);
  const { searchTerm, ...remainingFilters } = query;
  const andCondition: Prisma.RequestWhereInput[] = [];
  if (searchTerm) {
    andCondition.push({
      OR: flatShareRequestSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
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
  const whereCondition: Prisma.RequestWhereInput = {
    AND: andCondition,
  };

  const result = await prisma.request.findMany({
    where: whereCondition,
    include: {
      flat: true,
      member: true,
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.request.count({
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
const getFlatShareRequestById = async (id: string) => {
  const result = await prisma.request.findUnique({
    where: {
      id,
    },
    include: {
      flat: true,
      member: true,
    },
  });

  return result;
};

const updateFlatShareRequestStatus = async (id: string, status: Status) => {
  const result = await prisma.request.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });

  return result;
};

const deleteFlatShareRequest = async (id: string) => {
  const result = await prisma.request.delete({
    where: {
      id,
    },
  });

  return result;
};

export const FlatShareRequestServices = {
  addFlatShareRequest,
  getAllFlatShareRequests,
  getFlatShareRequestById,
  updateFlatShareRequestStatus,
  deleteFlatShareRequest,
};
