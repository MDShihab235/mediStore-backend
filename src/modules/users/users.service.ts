import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middlewares/auth";

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
};

const getUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return user;
};

const updateUserStatus = async (
  userId: string,
  status: "ACTIVE" | "BANNED",
) => {
  return prisma.user.update({
    where: { id: userId },
    data: { status },
  });
};

const updateUserRole = async (userId: string, role: UserRole) => {
  return prisma.user.update({
    where: { id: userId },
    data: { role },
  });
};

export const usersService = {
  getAllUsers,
  getUser,
  updateUserStatus,
  updateUserRole,
};
