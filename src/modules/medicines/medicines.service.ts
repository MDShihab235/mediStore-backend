import { Medicine } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createMedicine = async (
  data: Omit<
    Medicine,
    "id" | "createdAt" | "updatedAt" | "authorId" | "categoryId"
  > & {
    category: string;
  },
  userId: string,
) => {
  const result = await prisma.medicine.create({
    data: {
      ...data,
      expiryDate: new Date(data.expiryDate),
      authorId: userId,

      category: {
        connectOrCreate: {
          where: { name: data.category },
          create: { name: data.category },
        },
      },
    },
  });

  return result;
};

export const medicineService = {
  createMedicine,
};
