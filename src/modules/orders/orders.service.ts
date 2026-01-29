import { prisma } from "../../lib/prisma";

interface OrderItemInput {
  medicineId: string;
  quantity: number;
}

const createOrder = async (userId: string, items: OrderItemInput[]) => {
  if (!items || items.length === 0) {
    throw new Error("Order items are required");
  }

  return await prisma.$transaction(async (tx) => {
    let totalAmount = 0;

    // Fetch medicines
    const medicineIds = items.map((i) => i.medicineId);
    const medicines = await tx.medicine.findMany({
      where: { id: { in: medicineIds } },
    });

    if (medicines.length !== items.length) {
      throw new Error("One or more medicines not found");
    }

    // Prepare order items
    const orderItemsData = items.map((item) => {
      const medicine = medicines.find((m) => m.id === item.medicineId)!;

      if (medicine.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${medicine.name}`);
      }

      const itemTotal = Number(medicine.price) * item.quantity;
      totalAmount += itemTotal;

      return {
        medicineId: medicine.id,
        quantity: item.quantity,
        price: medicine.price,
      };
    });

    // Create order
    const order = await tx.order.create({
      data: {
        userId,
        totalAmount,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });

    // Reduce stock
    for (const item of items) {
      await tx.medicine.update({
        where: { id: item.medicineId },
        data: {
          stock: { decrement: item.quantity },
        },
      });
    }

    return order;
  });
};

const getUsersOrder = async (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const orders = await prisma.order.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: {
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              price: true,
              imageUrl: true,
              manufacturer: true,
            },
          },
        },
      },
    },
  });

  return orders;
};

const getSingleOrderDetails = async (orderId: string, userId: string) => {
  if (!orderId) {
    throw new Error("Order ID is required");
  }

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId, // VERY IMPORTANT: user can only see their own order
    },
    include: {
      items: {
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              manufacturer: true,
              price: true,
              imageUrl: true,
              expiryDate: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    throw new Error("Order not found or access denied");
  }

  return order;
};
export const orderService = {
  createOrder,
  getUsersOrder,
  getSingleOrderDetails,
};
