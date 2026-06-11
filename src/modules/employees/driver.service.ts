import {
  DeliveryStatus,
  EmployeeType,
  OrderStatus,
  PickupStatus,
  PrismaClient,
} from "../../../generated/prisma/client.js";
import { ApiError } from "../../utils/api-error.js";
import { GetAvailableDeliveriesDto } from "./dto/getAvailableDeliveries.dto.js";
import { GetAvailablePickupsDto } from "./dto/getAvailablePickups.dto.js";
import { GetDeliveryHistoryDTO } from "./dto/getDeliveryHistory.dto.js";
import { GetPickupHistoryDTO } from "./dto/getPickupHistory.dto.js";

export class DriverService {
  constructor(private prisma: PrismaClient) {}

  private async getDriverByUserId(userId: number) {
    const driver = await this.prisma.employee.findUnique({ where: { userId } });
    if (!driver) {
      throw new ApiError("Driver not found", 404);
    }
    if (driver.type !== EmployeeType.DRIVER) {
      throw new ApiError("Unauthorized access", 403);
    }
    return driver;
  }

  private async getPickupById(pickupId: string) {
    const pickup = await this.prisma.orderPickup.findUnique({
      where: { pickupId },
    });
    if (!pickup) throw new ApiError("Pickup not found", 404);
    return pickup;
  }

  private async getDeliveryById(deliveryId: string) {
    const delivery = await this.prisma.orderDelivery.findUnique({
      where: { deliveryId },
    });
    if (!delivery) throw new ApiError("Delivery not found", 404);
    return delivery;
  }

  private async getOrderById(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new ApiError("Order not found", 404);
    return order;
  }

  private hasActiveRequest = async (driverId: number) => {
    const activeDelivery = await this.prisma.orderDelivery.findFirst({
      where: {
        driverId,
        NOT: {
          status: {
            in: [DeliveryStatus.CANCELLED, DeliveryStatus.ARRIVED_AT_CUSTOMER],
          },
        },
      },
    });
    const activePickup = await this.prisma.orderPickup.findFirst({
      where: {
        driverId,
        NOT: {
          status: {
            in: [PickupStatus.CANCELLED, PickupStatus.ARRIVED_AT_OUTLET],
          },
        },
      },
    });
    return !!(activeDelivery || activePickup);
  };

  getAvailablePickups = async (
    driverId: number,
    { page, take, sortBy, sortOrder }: GetAvailablePickupsDto,
  ) => {
    const driver = await this.getDriverByUserId(driverId);

    if (!driver.outletId) {
      throw new ApiError("Driver has no outlet assigned", 400);
    }

    const outlet = await this.prisma.outlet.findUnique({
      where: { id: driver.outletId },
    });
    if (!outlet) throw new ApiError("Outlet not found", 404);

    const whereClause = { outletId: outlet.id, status: PickupStatus.PENDING };

    const [pickups, total] = await Promise.all([
      this.prisma.orderPickup.findMany({
        where: whereClause,
        take,
        skip: (page - 1) * take,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.orderPickup.count({ where: whereClause }),
    ]);

    return { data: pickups, meta: { page, take, total } };
  };

  getAvailableDeliveries = async (
    driverId: number,
    { page, take, sortBy, sortOrder }: GetAvailableDeliveriesDto,
  ) => {
    const driver = await this.getDriverByUserId(driverId);

    if (!driver.outletId) {
      throw new ApiError("Driver has no outlet assigned", 400);
    }

    const outlet = await this.prisma.outlet.findUnique({
      where: { id: driver.outletId },
    });
    if (!outlet) throw new ApiError("Outlet not found", 404);

    const whereClause = { outletId: outlet.id, status: DeliveryStatus.PENDING };

    const [deliveries, total] = await Promise.all([
      this.prisma.orderDelivery.findMany({
        where: whereClause,
        take,
        skip: (page - 1) * take,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.orderDelivery.count({ where: whereClause }),
    ]);

    return { data: deliveries, meta: { page, take, total } };
  };

  getActiveRequest = async (driverId: number) => {
    const driver = await this.getDriverByUserId(driverId);

    const activeDelivery = await this.prisma.orderDelivery.findFirst({
      where: {
        driverId,
        NOT: {
          status: {
            in: [DeliveryStatus.CANCELLED, DeliveryStatus.ARRIVED_AT_CUSTOMER],
          },
        },
      },
    });
    if (activeDelivery) return activeDelivery;

    const activePickup = await this.prisma.orderPickup.findFirst({
      where: {
        driverId,
        NOT: {
          status: {
            in: [PickupStatus.CANCELLED, PickupStatus.ARRIVED_AT_OUTLET],
          },
        },
      },
    });
    if (activePickup) return activePickup;

    throw new ApiError("No active requests found", 404);
  };

  getPickupHistory = async (
    userId: number,
    { page, take, sortBy, sortOrder }: GetPickupHistoryDTO,
  ) => {
    const driver = await this.getDriverByUserId(userId);
    const whereClause = { driverId: driver.id };
    const data = await this.prisma.orderPickup.findMany({
      where: whereClause,
      take,
      skip: (page - 1) * take,
      orderBy: { [sortBy]: sortOrder },
    });
    const total = await this.prisma.orderPickup.count({ where: whereClause });
    return { data, meta: { page, take, total } };
  };

  getDeliveryHistory = async (
    userId: number,
    { page, take, sortBy, sortOrder }: GetDeliveryHistoryDTO,
  ) => {
    const driver = await this.getDriverByUserId(userId);
    const whereClause = { driverId: driver.id };
    const data = await this.prisma.orderDelivery.findMany({
      where: whereClause,
      take,
      skip: (page - 1) * take,
      orderBy: { [sortBy]: sortOrder },
    });
    const total = await this.prisma.orderDelivery.count({ where: whereClause });
    return { data, meta: { page, take, total } };
  };

  assignPickup = async (userId: number, pickupId: string) => {
    const driver = await this.getDriverByUserId(userId);
    const pickup = await this.getPickupById(pickupId);

    if (pickup.driverId != null)
      throw new ApiError("Pickup already assigned", 400);
    if (await this.hasActiveRequest(driver.id))
      throw new ApiError("Driver already has an order", 400);

    await this.prisma.orderPickup.update({
      where: { id: pickup.id },
      data: { driverId: driver.id, status: PickupStatus.OTW_TO_CUSTOMER },
    });
    return { message: "Pickup assignment successful" };
  };

  finishPickup = async (userId: number, pickupId: string) => {
    const driver = await this.getDriverByUserId(userId);
    const pickup = await this.getPickupById(pickupId);
    const order = await this.getOrderById(pickup.orderId);

    await this.prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: { orderStatus: OrderStatus.ARRIVED_AT_OUTLET },
      });
      await tx.orderPickup.update({
        where: { id: pickup.id },
        data: { status: PickupStatus.ARRIVED_AT_OUTLET },
      });

      const notification = await tx.notification.create({
        data: {
          title: "Order Arrived",
          body: `Order #${order.id} arrived at outlet`,
        },
      });

      const admins = await tx.employee.findMany({
        where: { outletId: order.outletId, type: EmployeeType.ADMIN },
        select: { userId: true },
      });
      await tx.notificationsOnUsers.createMany({
        data: admins.map((a) => ({
          userId: a.userId,
          notificationId: notification.id,
        })),
      });
    });

    return { message: "Order successfully delivered to outlet" };
  };

  assignDelivery = async (userId: number, deliveryId: string) => {
    const driver = await this.getDriverByUserId(userId);
    const delivery = await this.getDeliveryById(deliveryId);

    if (delivery.driverId != null)
      throw new ApiError("Delivery already assigned", 400);
    if (await this.hasActiveRequest(driver.id))
      throw new ApiError("Driver already has an order", 400);

    await this.prisma.orderDelivery.update({
      where: { id: delivery.id },
      data: { driverId: driver.id, status: DeliveryStatus.PENDING },
    });
    return { message: "Delivery assignment successful" };
  };

  finishDelivery = async (userId: number, deliveryId: string) => {
    const driver = await this.getDriverByUserId(userId);
    const delivery = await this.getDeliveryById(deliveryId);
    const order = await this.getOrderById(delivery.orderId);

    await this.prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: { orderStatus: OrderStatus.ARRIVED_AT_CUSTOMER },
      });
      await tx.orderDelivery.update({
        where: { id: delivery.id },
        data: { status: DeliveryStatus.ARRIVED_AT_CUSTOMER },
      });

      const notification = await tx.notification.create({
        data: {
          title: "Order Delivered",
          body: `Order #${order.id} delivered to customer`,
        },
      });

      const admins = await tx.employee.findMany({
        where: { outletId: order.outletId, type: EmployeeType.ADMIN },
        select: { userId: true },
      });
      await tx.notificationsOnUsers.createMany({
        data: admins.map((a) => ({
          userId: a.userId,
          notificationId: notification.id,
        })),
      });
    });

    return { message: "Order successfully delivered to customer" };
  };

  cancelPickup = async (userId: number, pickupId: string) => {
    const driver = await this.getDriverByUserId(userId);
    const pickup = await this.getPickupById(pickupId);

    if (pickup.driverId !== driver.id)
      throw new ApiError("Pickup not assigned to this driver", 404);

    await this.prisma.orderPickup.update({
      where: { id: pickup.id },
      data: { status: PickupStatus.CANCELLED, driverId: null },
    });
    return { message: "Pickup request cancelled" };
  };

  cancelDelivery = async (userId: number, deliveryId: string) => {
    const driver = await this.getDriverByUserId(userId);
    const delivery = await this.getDeliveryById(deliveryId);

    if (delivery.driverId !== driver.id) {
      throw new ApiError("Delivery not assigned to this driver", 404);
    }

    await this.prisma.orderDelivery.update({
      where: { id: delivery.id },
      data: { status: DeliveryStatus.CANCELLED, driverId: null },
    });

    return { message: "Delivery request cancelled" };
  };
}
