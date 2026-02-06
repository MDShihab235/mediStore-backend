import { Medicine } from "../../../generated/prisma/client";
import { MedicineWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

//Private Routes --- Admin/Seller routes
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

const updateMedicine = async (
  medicineId: string,
  data: Partial<Medicine>,
  authorId: string,
  isAuthorized: boolean,
) => {
  const medicineData = await prisma.medicine.findUniqueOrThrow({
    where: {
      id: medicineId,
    },
    select: {
      id: true,
      authorId: true,
    },
  });

  if (!isAuthorized && medicineData.authorId !== authorId) {
    throw new Error("You are not the owner/creator of the post!");
  }

  const result = await prisma.medicine.update({
    where: {
      id: medicineData.id,
    },
    data,
  });
  return result;
};

const deleteMedicine = async (
  medicineId: string,
  authorId: string,
  isAuthorized: boolean,
) => {
  const medicineData = await prisma.medicine.findUniqueOrThrow({
    where: {
      id: medicineId,
    },
    select: {
      id: true,
      authorId: true,
    },
  });
  if (!isAuthorized && medicineData.authorId !== authorId) {
    throw new Error("You are not the owner/creator of the post!");
  }
  return await prisma.medicine.delete({
    where: {
      id: medicineId,
    },
  });
};

const getAllMedicines = async ({
  search,
  category,
  minPrice,
  maxPrice,
  manufacturer,
  authorId,
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: {
  search?: string | undefined;
  category?: string | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  manufacturer?: string | undefined;
  authorId?: string | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}) => {
  const andConditions: MedicineWhereInput[] = [];

  if (search) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          manufacturer: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          category: {
            is: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
      ],
    });
  }

  if (category) {
    andConditions.push({
      category: {
        is: {
          name: {
            equals: category,
            mode: "insensitive",
          },
        },
      },
    });
  }

  if (manufacturer) {
    andConditions.push({
      manufacturer: {
        equals: manufacturer,
        mode: "insensitive",
      },
    });
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    const priceFilter: any = {};
    if (minPrice !== undefined) priceFilter.gte = minPrice;
    if (maxPrice !== undefined) priceFilter.lte = maxPrice;
    andConditions.push({
      price: priceFilter,
    });
  }

  if (authorId) {
    andConditions.push({ authorId });
  }

  const whereCondition: MedicineWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

  const data = await prisma.medicine.findMany({
    take: limit,
    skip,
    where: whereCondition,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      category: true,
      _count: {
        select: {
          orderItems: true,
          reviews: true,
        },
      },
    },
  });

  const total = await prisma.medicine.count({
    where: whereCondition,
  });

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPage: Math.ceil(total / limit),
    },
  };
};

const getMedicineById = async (medicineId: string) => {
  const medicine = await prisma.medicine.findUnique({
    where: {
      id: medicineId,
    },
    include: {
      category: true,
      orderItems: true,
      reviews: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },

      _count: {
        select: {
          reviews: true,
          orderItems: true,
        },
      },
    },
  });

  if (!medicine) {
    throw new Error("Medicine not found");
  }

  return medicine;
};

const getAllCategories = async () => {
  const result = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          medicines: true,
        },
      },
    },
  });
  return result;
};

export const medicineService = {
  createMedicine,
  getAllMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
  getAllCategories,
};
