import {
  DeliveryStatus,
  EmployeeType,
  PickupStatus,
  PrismaClient,
} from "../../../generated/prisma/client.js";
import { ApiError } from "../../utils/api-error.js";

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

  getRequestHistory = async (driverId: number) => {
    const driver = await this.prisma.employee.findUnique({
      where: {
        id: driverId,
      },
    });

    if (!driver || driver.type !== EmployeeType.DRIVER) {
      throw new ApiError("Driver not found", 404);
    }

    const pickups = await this.prisma.orderPickup.findMany({
      where: {
        driverId,
      },
    });

    const deliveries = await this.prisma.orderDelivery.findMany({
      where: {
        driverId,
      },
    });

    return { pickups, deliveries };
  };

  assignPickup = async (driverId: number, pickupId: number) => {
    const driver = await this.prisma.employee.findUnique({
      where: {
        id: driverId,
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

    if (await this.hasActiveRequest(driverId)) {
      throw new ApiError("Driver already has an order assigned", 400);
    }

    await this.prisma.orderPickup.update({
      where: {
        id: pickupId,
      },
      data: {
        driverId,
        status: PickupStatus.PENDING,
      },
    });

    return { message: "Pickup assignment to driver successful" };
  };

  assignDelivery = async (driverId: number, deliveryId: number) => {
    const driver = await this.prisma.employee.findUnique({
      where: {
        id: driverId,
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

    if (await this.hasActiveRequest(driverId)) {
      throw new ApiError("Driver already has an order assigned", 400);
    }

    await this.prisma.orderDelivery.update({
      where: {
        id: deliveryId,
      },
      data: {
        driverId,
        status: DeliveryStatus.PENDING,
      },
    });

    return { message: "Delivery assignment to driver successful" };
  };
}
