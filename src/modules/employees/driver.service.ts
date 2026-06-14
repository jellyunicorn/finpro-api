import {
  DeliveryStatus,
  EmployeeType,
  OrderStatus,
  PickupStatus,
  PrismaClient,
} from "../../../generated/prisma/client.js";
import { ApiError } from "../../utils/api-error.js";
import { PaginationQueryParams } from "../pagination/pagination.dto.js";
import { GetAvailableDeliveriesDto } from "./dto/getAvailableDeliveries.dto.js";
import { GetAvailablePickupsDto } from "./dto/getAvailablePickups.dto.js";
import { GetDeliveryHistoryDTO } from "./dto/getDeliveryHistory.dto.js";
import { GetPickupHistoryDTO } from "./dto/getPickupHistory.dto.js";

export class DriverService {
  constructor(private prisma: PrismaClient) {}

  private getDriverByUserId = async (userId: number) => {
    const driver = await this.prisma.employee.findUnique({ where: { userId } });
    if (!driver) {
      throw new ApiError("Driver not found", 404);
    }
    if (driver.type !== EmployeeType.DRIVER) {
      throw new ApiError("Unauthorized access", 403);
    }
    return driver;
  };

  private getPickupById = async (pickupId: string) => {
    const pickup = await this.prisma.orderPickup.findUnique({
      where: { pickupId },
    });
    if (!pickup) throw new ApiError("Pickup not found", 404);
    return pickup;
  };

  private getDeliveryById = async (deliveryId: string) => {
    const delivery = await this.prisma.orderDelivery.findUnique({
      where: { deliveryId },
    });
    if (!delivery) throw new ApiError("Delivery not found", 404);
    return delivery;
  };

  private getOrderById = async (orderId: number) => {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new ApiError("Order not found", 404);
    return order;
  };

  private getOutletById = async (outletId: number) => {
    const outlet = await this.prisma.outlet.findUnique({
      where: { id: outletId },
    });
    if (!outlet) throw new ApiError("Outlet not found", 404);
    return outlet;
  };

  private formatPickupData = (pickup: any) => {
    return {
      id: pickup.pickupId,
      createdAt: pickup.createdAt,
      status: pickup.status,
      orderId: pickup.order.orderId,
      distance: pickup.order.distance,
      customerName: pickup.order.user.fullName,
      address: pickup.order.address?.address ?? null,
      outletLongitude: pickup.order.outlet.longitude,
      outletLatitude: pickup.order.outlet.latitude,
      userLongitude: pickup.order.address?.longitude ?? null,
      userLatitude: pickup.order.address?.latitude ?? null,
      postalCode: pickup.order.address?.postalCode ?? null,
      regency: pickup.order.address?.regency?.name ?? null,
      district: pickup.order.address?.district?.name ?? null,
      village: pickup.order.address?.village?.name ?? null,
    };
  };

  private formatDeliveryData = (delivery: any) => {
    return {
      id: delivery.deliveryId,
      createdAt: delivery.createdAt,
      status: delivery.status,
      orderId: delivery.order.orderId,
      distance: delivery.order.distance,
      customerName: delivery.order.user.fullName,
      address: delivery.order.address?.address ?? null,
      outletLongitude: delivery.order.outlet.longitude,
      outletLatitude: delivery.order.outlet.latitude,
      userLongitude: delivery.order.address?.longitude ?? null,
      userLatitude: delivery.order.address?.latitude ?? null,
      postalCode: delivery.order.address?.postalCode ?? null,
      regency: delivery.order.address?.regency?.name ?? null,
      district: delivery.order.address?.district?.name ?? null,
      village: delivery.order.address?.village?.name ?? null,
    };
  };

  private getPickupsWhere = async (
    whereClause: any,
    dto: PaginationQueryParams,
  ) => {
    const { page, take, sortBy, sortOrder } = dto;
    const [pickups, total] = await Promise.all([
      this.prisma.orderPickup.findMany({
        where: whereClause,
        take,
        skip: (page - 1) * take,
        orderBy: { [sortBy]: sortOrder },
        select: {
          pickupId: true,
          createdAt: true,
          status: true,
          order: {
            select: {
              orderId: true,
              distance: true,
              user: { select: { fullName: true } },
              outlet: { select: { latitude: true, longitude: true } },
              address: {
                select: {
                  address: true,
                  longitude: true,
                  latitude: true,
                  postalCode: true,
                  regency: { select: { name: true } },
                  district: { select: { name: true } },
                  village: { select: { name: true } },
                },
              },
            },
          },
        },
      }),
      this.prisma.orderPickup.count({ where: whereClause }),
    ]);
    const data = pickups.map((pickup) => this.formatPickupData(pickup));
    return { data, meta: { page, take, total } };
  };

  private getDeliveriesWhere = async (
    whereClause: any,
    dto: PaginationQueryParams,
  ) => {
    const { page, take, sortBy, sortOrder } = dto;
    const [deliveries, total] = await Promise.all([
      this.prisma.orderDelivery.findMany({
        where: whereClause,
        take,
        skip: (page - 1) * take,
        orderBy: { [sortBy]: sortOrder },
        select: {
          deliveryId: true,
          createdAt: true,
          status: true,
          order: {
            select: {
              orderId: true,
              distance: true,
              user: { select: { fullName: true } },
              outlet: { select: { latitude: true, longitude: true } },
              address: {
                select: {
                  address: true,
                  longitude: true,
                  latitude: true,
                  postalCode: true,
                  regency: { select: { name: true } },
                  district: { select: { name: true } },
                  village: { select: { name: true } },
                },
              },
            },
          },
        },
      }),
      this.prisma.orderDelivery.count({ where: whereClause }),
    ]);
    const data = deliveries.map((delivery) =>
      this.formatDeliveryData(delivery),
    );
    return { data, meta: { page, take, total } };
  };

  private hasActiveRequest = async (driverId: number) => {
    const activeDelivery = await this.prisma.orderDelivery.findFirst({
      where: {
        driverId,
        NOT: {
          status: {
            in: [
              DeliveryStatus.CANCELLED,
              DeliveryStatus.PENDING,
              DeliveryStatus.ARRIVED_AT_CUSTOMER,
            ],
          },
        },
      },
    });
    const activePickup = await this.prisma.orderPickup.findFirst({
      where: {
        driverId,
        NOT: {
          status: {
            in: [
              PickupStatus.CANCELLED,
              PickupStatus.PENDING,
              PickupStatus.ARRIVED_AT_OUTLET,
            ],
          },
        },
      },
    });
    return !!(activeDelivery || activePickup);
  };

  getAvailablePickups = async (
    driverId: number,
    dto: GetAvailablePickupsDto,
  ) => {
    const driver = await this.getDriverByUserId(driverId);

    if (!driver.outletId) {
      throw new ApiError("Driver has no outlet assigned", 400);
    }

    const outlet = await this.getOutletById(driver.outletId);

    const whereClause = {
      outletId: outlet.id,
      status: PickupStatus.PENDING,
      driverId: null,
    };

    return this.getPickupsWhere(whereClause, dto);
  };

  getAvailableDeliveries = async (
    driverId: number,
    dto: GetAvailableDeliveriesDto,
  ) => {
    const driver = await this.getDriverByUserId(driverId);

    if (!driver.outletId) {
      throw new ApiError("Driver has no outlet assigned", 400);
    }

    const outlet = await this.prisma.outlet.findUnique({
      where: { id: driver.outletId },
    });
    if (!outlet) throw new ApiError("Outlet not found", 404);

    const whereClause = {
      outletId: outlet.id,
      status: DeliveryStatus.PENDING,
      driverId: null,
    };

    return this.getDeliveriesWhere(whereClause, dto);
  };

  getActiveRequest = async (driverId: number) => {
    const driver = await this.getDriverByUserId(driverId);

    const deliveryWhere = {
      driverId: driver.id,
      NOT: {
        status: {
          in: [
            DeliveryStatus.CANCELLED,
            DeliveryStatus.ARRIVED_AT_CUSTOMER,
            DeliveryStatus.PENDING,
          ],
        },
      },
    };

    const orderSelect = {
      select: {
        orderId: true,
        distance: true,
        user: { select: { fullName: true } },
        outlet: { select: { latitude: true, longitude: true } },
        address: {
          select: {
            address: true,
            longitude: true,
            latitude: true,
            postalCode: true,
            regency: { select: { name: true } },
            district: { select: { name: true } },
            village: { select: { name: true } },
          },
        },
      },
    };

    const activeDelivery = await this.prisma.orderDelivery.findFirst({
      where: deliveryWhere,
      select: {
        deliveryId: true,
        status: true,
        driverId: true,
        order: orderSelect,
      },
    });

    if (activeDelivery) {
      const data = this.formatDeliveryData(activeDelivery);
      return { ...data, type: "delivery" };
    }

    const pickupWhere = {
      driverId: driver.id,
      NOT: {
        status: {
          in: [
            PickupStatus.CANCELLED,
            PickupStatus.ARRIVED_AT_OUTLET,
            PickupStatus.PENDING,
          ],
        },
      },
    };

    const activePickup = await this.prisma.orderPickup.findFirst({
      where: pickupWhere,
      select: {
        pickupId: true,
        status: true,
        driverId: true,
        order: orderSelect,
      },
    });

    if (activePickup) {
      const data = this.formatPickupData(activePickup);
      return { ...data, type: "pickup" };
    }

    throw new ApiError("No active requests found", 404);
  };

  getPickupHistory = async (userId: number, dto: GetPickupHistoryDTO) => {
    const driver = await this.getDriverByUserId(userId);

    const whereClause = {
      driverId: driver.id,
      status: { in: [PickupStatus.ARRIVED_AT_OUTLET, PickupStatus.CANCELLED] },
    };

    return this.getPickupsWhere(whereClause, dto);
  };

  getDeliveryHistory = async (userId: number, dto: GetDeliveryHistoryDTO) => {
    const driver = await this.getDriverByUserId(userId);

    const whereClause = {
      driverId: driver.id,
      status: {
        in: [DeliveryStatus.ARRIVED_AT_CUSTOMER, DeliveryStatus.CANCELLED],
      },
    };

    return this.getDeliveriesWhere(whereClause, dto);
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
      data: { driverId: driver.id, status: PickupStatus.WAITING_FOR_DRIVER },
    });
    return { message: "Pickup assignment successful" };
  };

  advancePickupStatus = async (userId: number, pickupId: string) => {
    const driver = await this.getDriverByUserId(userId);
    const pickup = await this.getPickupById(pickupId);
    const order = await this.getOrderById(pickup.orderId);

    if (pickup.status !== PickupStatus.WAITING_FOR_DRIVER) {
      throw new ApiError("Pickup status is not WAITING_FOR_DRIVER", 400);
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: { orderStatus: OrderStatus.OTW_TO_OUTLET },
      });

      await tx.orderPickup.update({
        where: { id: pickup.id },
        data: { status: PickupStatus.OTW_TO_OUTLET },
      });

      const notification = await tx.notification.create({
        data: {
          title: "Driver on the Way",
          body: `Order #${order.id} is on the way to outlet`,
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
      data: { driverId: driver.id, status: DeliveryStatus.WAITING_FOR_DRIVER },
    });
    return { message: "Delivery assignment successful" };
  };

  advanceDeliveryStatus = async (userId: number, deliveryId: string) => {
    const driver = await this.getDriverByUserId(userId);
    const delivery = await this.getDeliveryById(deliveryId);
    const order = await this.getOrderById(delivery.orderId);

    if (delivery.status !== DeliveryStatus.WAITING_FOR_DRIVER) {
      throw new ApiError("Delivery status is not WAITING_FOR_DRIVER", 400);
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: { orderStatus: OrderStatus.OTW_TO_CUSTOMER },
      });

      await tx.orderDelivery.update({
        where: { id: delivery.id },
        data: { status: DeliveryStatus.OTW_TO_CUSTOMER },
      });

      const notification = await tx.notification.create({
        data: {
          title: "Driver on the Way",
          body: `Order #${order.id} is on the way to customer`,
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
      data: { status: PickupStatus.PENDING, driverId: null },
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
      data: { status: DeliveryStatus.PENDING, driverId: null },
    });

    return { message: "Delivery request cancelled" };
  };
}
