import { prisma } from "../../lib/prisma";

interface OrderItemInput {
  medicineId: string;
  quantity: number;
}
// interface CartItemInput {
//   medicineId: string;
//   quantity: number;
// }

const createOrder = async (
  userId: string,
  items: OrderItemInput[],
  shippingAddress: string,
) => {
  if (!items || items.length === 0) {
    throw new Error("Order items are required");
  }
  if (!shippingAddress) {
    throw new Error("Shipping address is required");
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
        paymentType: "CASH_ON_DELIVERY",
        shippingAddress,
        items: { create: orderItemsData },
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

const getSellerOrders = async (sellerId: string) => {
  if (!sellerId) {
    throw new Error("Seller ID is required");
  }

  const orders = await prisma.order.findMany({
    where: {
      items: {
        some: {
          medicine: {
            authorId: sellerId, // seller owns the medicine
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      items: {
        where: {
          medicine: {
            authorId: sellerId, // ONLY seller's items
          },
        },
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              price: true,
              imageUrl: true,
            },
          },
        },
      },
    },
  });

  return orders;
};

const getMedicineStock = async (medicineId: string) => {
  const stock = await prisma.medicine.findUnique({
    where: { id: medicineId },
    select: { stock: true },
  });
  return stock;
};

const validateCartStock = async (items: OrderItemInput[]) => {
  if (!items || items.length === 0) {
    throw new Error("Cart items are required");
  }

  const medicineIds = items.map((i) => i.medicineId);

  const medicines = await prisma.medicine.findMany({
    where: { id: { in: medicineIds } },
    select: {
      id: true,
      name: true,
      stock: true,
    },
  });

  const errors = [];

  for (const item of items) {
    const medicine = medicines.find((m) => m.id === item.medicineId);

    if (!medicine) {
      errors.push({
        medicineId: item.medicineId,
        message: "Medicine not found",
      });
      continue;
    }

    if (medicine.stock === 0) {
      errors.push({
        medicineId: medicine.id,
        message: "Stock not available",
        availableStock: 0,
      });
      continue;
    }

    if (item.quantity > medicine.stock) {
      errors.push({
        medicineId: medicine.id,
        message: "Insufficient stock",
        availableStock: medicine.stock,
      });
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true };
};

const cancelOrder = async (orderId: string, userId: string) => {
  if (!orderId) {
    throw new Error("Order ID is required");
  }

  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findFirst({
      where: {
        id: orderId,
        userId, // 🔐 ownership check
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new Error("Order not found or access denied");
    }

    if (order.status !== "PENDING") {
      throw new Error("Only pending orders can be cancelled");
    }

    // 🔄 Restore stock
    for (const item of order.items) {
      await tx.medicine.update({
        where: { id: item.medicineId },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
      });
    }

    // ❌ Cancel order
    const cancelledOrder = await tx.order.update({
      where: { id: orderId },
      data: {
        status: "CANCELLED",
      },
    });

    return cancelledOrder;
  });
};

export const orderService = {
  createOrder,
  getUsersOrder,
  getSingleOrderDetails,
  getSellerOrders,
  getMedicineStock,
  validateCartStock,
  cancelOrder,
};
