import {
  DeliveryStatus,
  EmployeeType,
  OrderStatus,
  PickupStatus,
  PrismaClient,
} from "../../../generated/prisma/client.js";
import { ApiError } from "../../utils/api-error.js";
import { GetDeliveryHistoryDTO } from "./dto/getDeliveryHistory.dto.js";
import { GetPickupHistoryDTO } from "./dto/getPickupHistory.dto.js";

export class DriverService {
  constructor(private prisma: PrismaClient) {}

  hasActiveRequest = async (driverId: number) => {
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

  getActiveRequest = async (driverId: number) => {
    const driver = await this.prisma.employee.findUnique({
      where: {
        id: driverId,
      },
    });

    if (!driver || driver.type !== EmployeeType.DRIVER) {
      throw new ApiError("Driver not found", 404);
    }

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

    if (activeDelivery) {
      return activeDelivery;
    }

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

    if (activePickup) {
      return activePickup;
    }

    throw new ApiError("No active requests found", 404);
  };

  getPickupHistory = async ({
    userId,
    page,
    take,
    sortBy,
    sortOrder,
  }: GetPickupHistoryDTO) => {
    const driver = await this.prisma.employee.findUnique({
      where: {
        userId,
      },
    });

    if (!driver || driver.type !== EmployeeType.DRIVER) {
      throw new ApiError("Driver not found", 404);
    }

    const whereClause = { driverId: driver.id };

    const pickups = await this.prisma.orderPickup.findMany({
      where: whereClause,
      take,
      skip: (page - 1) * take,
      orderBy: { [sortBy]: sortOrder },
    });

    const total = await this.prisma.orderPickup.count({
      where: whereClause,
    });

    return { data: pickups, meta: { page, take, total } };
  };

  getDeliveryHistory = async ({
    userId,
    page,
    take,
    sortBy,
    sortOrder,
  }: GetDeliveryHistoryDTO) => {
    const driver = await this.prisma.employee.findUnique({
      where: {
        userId,
      },
    });

    if (!driver || driver.type !== EmployeeType.DRIVER) {
      throw new ApiError("Driver not found", 404);
    }

    const whereClause = { driverId: driver.id };

    const deliveries = await this.prisma.orderDelivery.findMany({
      where: whereClause,
      take,
      skip: (page - 1) * take,
      orderBy: { [sortBy]: sortOrder },
    });

    const total = await this.prisma.orderPickup.count({
      where: whereClause,
    });

    return { data: deliveries, meta: { page, take, total } };
  };

  assignPickup = async (userId: number, pickupId: number) => {
    const driver = await this.prisma.employee.findUnique({
      where: {
        userId,
      },
    });

    if (!driver || driver.type !== EmployeeType.DRIVER) {
      throw new ApiError("Driver not found", 404);
    }

    const pickup = await this.prisma.orderPickup.findUnique({
      where: {
        id: pickupId,
      },
    });

    if (!pickup) {
      throw new ApiError("Pickup not found", 404);
    }

    if (pickup.driverId != null) {
      throw new ApiError("Pickup is already assigned to another driver", 400);
    }

    if (await this.hasActiveRequest(driver.id)) {
      throw new ApiError("Driver already has an order assigned", 400);
    }

    await this.prisma.orderPickup.update({
      where: {
        id: pickupId,
      },
      data: {
        driverId: driver.id,
        status: PickupStatus.OTW_TO_CUSTOMER,
      },
    });

    return { message: "Pickup assignment to driver successful" };
  };

  finishPickup = async (userId: number, pickupId: number) => {
    const driver = await this.prisma.employee.findUnique({
      where: {
        userId,
      },
    });

    if (!driver || driver.type !== EmployeeType.DRIVER) {
      throw new ApiError("Driver not found", 404);
    }

    const pickup = await this.prisma.orderPickup.findUnique({
      where: {
        id: pickupId,
      },
    });

    if (!pickup) {
      throw new ApiError("Pickup not found", 404);
    }

    const orderId = pickup.orderId;

    if (!orderId) {
      throw new ApiError("Order not found", 404);
    }

    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      throw new ApiError("Order not found", 404);
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: {
          id: orderId,
        },
        data: {
          orderStatus: OrderStatus.ARRIVED_AT_OUTLET,
        },
      });

      await tx.orderPickup.update({
        where: {
          id: pickupId,
        },
        data: {
          status: PickupStatus.ARRIVED_AT_OUTLET,
        },
      });

      const notification = await tx.notification.create({
        data: {
          title: "Order Arrived",
          body: `Order #${orderId} arrived at outlet`,
        },
      });

      const admins = await tx.employee.findMany({
        where: {
          outletId: order.outletId,
          type: EmployeeType.ADMIN,
        },
        select: {
          userId: true,
        },
      });

      await tx.notificationsOnUsers.createMany({
        data: admins.map((admin) => ({
          userId: admin.userId,
          notificationId: notification.id,
        })),
      });
    });

    return { message: "Order successfully delivered to outlet" };
  };

  assignDelivery = async (userId: number, deliveryId: number) => {
    const driver = await this.prisma.employee.findUnique({
      where: {
        userId,
      },
    });

    if (!driver || driver.type !== EmployeeType.DRIVER) {
      throw new ApiError("Driver not found", 404);
    }

    const delivery = await this.prisma.orderDelivery.findUnique({
      where: {
        id: deliveryId,
      },
    });

    if (!delivery) {
      throw new ApiError("Delivery not found", 404);
    }

    if (delivery.driverId != null) {
      throw new ApiError("Delivery is already assigned to another driver", 400);
    }

    if (await this.hasActiveRequest(driver.id)) {
      throw new ApiError("Driver already has an order assigned", 400);
    }

    await this.prisma.orderDelivery.update({
      where: {
        id: deliveryId,
      },
      data: {
        driverId: driver.id,
        status: DeliveryStatus.PENDING,
      },
    });

    return { message: "Delivery assignment to driver successful" };
  };
}
