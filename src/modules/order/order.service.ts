import {
  EmployeeType,
  PrismaClient,
} from "../../../generated/prisma/client.js";
import { ApiError } from "../../utils/api-error.js";
import { CreateOrderDTO } from "./dto/order.dto.js";

export class OrderServices {
  constructor(private prisma: PrismaClient) {}

  getOrders = async (
    id: number,
    searchQuery: string | undefined,
    monthQuery: number,
    dateQuery: number,
    page: number,
    limit: number,
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

    const skip = (page - 1) * limit;

    const result = await this.prisma.order.findMany({
      where,
      include: { outlet: true, address: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });
    const total = await this.prisma.order.count({ where });

    return {
      data: result,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  };

  addNewOrder = async (body: CreateOrderDTO, id: number) => {
    const checkoutlet = await this.prisma.outlet.findUnique({
      where: { id: body.outletId },
    });

    if (!checkoutlet) {
      throw new ApiError("outlet does not exist", 404);
    }

    const address = await this.prisma.userAddress.findFirst({
      where: { id: body.pickupAddressId, userId: id, deletedAt: null },
    });

    if (!address) throw new ApiError("Pickup address not found", 404);

    await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          scheduledTime: new Date(`${body.pickupDate}T${body.pickupTime}`),
          orderStatus: "WAITING_FOR_DRIVER",
          deliveryCost: 0,
          paymentStatus: "PENDING",
          distance: body.distance,
          userId: id,
          outletId: body.outletId,
          addressId: body.pickupAddressId,
        },
      });

      const orderPickup = await tx.orderPickup.create({
        data: {},
      });

      const driverNotification = await tx.notification.create({
        data: {
          title: "New Order Created",
          body: `Order #${orderPickup.pickupId} ready for pickup`,
        },
      });

      const drivers = await tx.employee.findMany({
        where: {
          outletId: body.outletId,
          type: EmployeeType.DRIVER,
        },
        select: {
          userId: true,
        },
      });

      await tx.notificationsOnUsers.createMany({
        data: drivers.map((driver) => ({
          userId: driver.userId,
          notificationId: driverNotification.id,
        })),
      });
    });

    return { message: "New order created" };
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

  softDeleteOrder = async (orderId: string, userId: number) => {
    const order = await this.prisma.order.findFirst({
      where: { orderId, userId, deletedAt: null },
    });

    if (!order) throw new ApiError("Order not found", 404);

    return await this.prisma.order.update({
      where: { orderId },
      data: { deletedAt: new Date() },
    });
  };
}
