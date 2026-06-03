import { PrismaClient } from "../../../generated/prisma/client.js";
import { ApiError } from "../../utils/api-error.js";

type neworder = {
  pickupaddressid: number;
  outletid: number;
  pickupDate: string;
  pickupTime: string;
  distance: number;
};
export class OrderServices {
  constructor(private prisma: PrismaClient) {}

  getOrders = async (
    id: number,
    searchQuery: string | undefined,
    monthQuery: number,
    dateQuery: number,
  ) => {
    const where: any = { userId: id, deletedAt: null };

    const year = new Date().getFullYear();
    if (monthQuery && dateQuery) {
      const start = new Date(year, monthQuery - 1, dateQuery);
      const end = new Date(year, monthQuery - 1, dateQuery + 1);
      where.createdAt = { gte: start, lt: end };
    } else if (monthQuery) {
      const start = new Date(year, monthQuery - 1, 1);
      const end = new Date(year, monthQuery, 1);
      where.createdAt = { gte: start, lt: end };
    } else if (dateQuery) {
      const month = new Date().getMonth();
      const start = new Date(year, month, dateQuery);
      const end = new Date(year, month, dateQuery + 1);
      where.createdAt = { gte: start, lt: end };
    }

    if (searchQuery) {
      where.orderId = { contains: searchQuery, mode: "insensitive" };
    }

    return await this.prisma.order.findMany({
      where,
      include: { outlet: true, address: true },
      orderBy: { createdAt: "desc" },
    });
  };

  addNewOrder = async (body: neworder, id: number) => {
    const checkoutlet = await this.prisma.outlet.findUnique({
      where: { id: body.outletid },
    });

    if (!checkoutlet) {
      throw new ApiError("outlet does not exist", 404);
    }

    const address = await this.prisma.userAddress.findFirst({
      where: { id: body.pickupaddressid, userId: id, deletedAt: null },
    });
    if (!address) throw new ApiError("Pickup address not found", 404);

    const res = await this.prisma.order.create({
      data: {
        scheduledTime: new Date(`${body.pickupDate}T${body.pickupTime}`),
        orderStatus: "PENDING",
        deliveryCost: 0,
        paymentStatus: "PENDING",
        distance: body.distance,
        userId: id,
        outletId: body.outletid,
        addressId: body.pickupaddressid,
      },
    });

    return { message: "new order created" };
  };

  getOrderItems = async (orderId: string, userId: number) => {
    const order = await this.prisma.order.findFirst({
      where: { orderId, userId, deletedAt: null },
    });

    if (!order) throw new ApiError("Order not found", 404);
    const orderid = order.id;
    return await this.prisma.orderItem.findMany({
      where: { orderId: orderid, deletedAt: null },
      select: {
        id: true,
        name: true,
        orderId: true,
        price: true,
        quantity: true,
        weight: true,
        description: true,
      },
    });
  };

  getOrderItemsTotal = async (orderId: string, userId: number) => {
    const order = await this.prisma.order.findFirst({
      where: { orderId, userId, deletedAt: null },
    });

    if (!order) throw new ApiError("Order not found", 404);
    const orderid = order.id;
    const items = await this.prisma.orderItem.findMany({
      where: { orderId: orderid, deletedAt: null },
      select: {
        price: true,
        quantity: true,
      },
    });

    let total: number = 0;

    items.forEach((e) => {
      const subtotal = e.price * e.quantity;
      total = total + subtotal;
    });

    return { total };
  };

  getOrderDetail = async (orderId: string, userId: number) => {
    const order = await this.prisma.order.findFirst({
      where: { orderId, userId, deletedAt: null },
    });

    if (!order) throw new ApiError("Order not found", 404);

    return await this.prisma.order.findUnique({
      where: { orderId },
      include: { outlet: true, address: true, orderItems: true },
    });
  };
}
