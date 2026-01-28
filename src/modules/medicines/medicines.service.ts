import { Medicine } from "../../../generated/prisma/client";
import { MedicineWhereInput } from "../../../generated/prisma/models";
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

//Customer public routes
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

  /* 🔍 Search (name, manufacturer, category) */
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

  /* 🧾 Category filter */
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

  /* 🏭 Manufacturer filter */
  if (manufacturer) {
    andConditions.push({
      manufacturer: {
        equals: manufacturer,
        mode: "insensitive",
      },
    });
  }

  /* 💰 Price range filter */
  if (minPrice !== undefined || maxPrice !== undefined) {
    const priceFilter: any = {};
    if (minPrice !== undefined) priceFilter.gte = minPrice;
    if (maxPrice !== undefined) priceFilter.lte = maxPrice;
    andConditions.push({
      price: priceFilter,
    });
  }

  /* 👤 Author (seller) filter */
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

export const medicineService = {
  createMedicine,
  getAllMedicines,
  getMedicineById,
};
