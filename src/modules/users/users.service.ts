import { prisma } from "../../lib/prisma";

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
};

// const getUser = async()=>{

// }

export const usersService = {
  getAllUsers,
};
