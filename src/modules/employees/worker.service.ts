import {
  EmployeeType,
  OrderStatus,
  PaymentStatus,
  Prisma,
  PrismaClient,
  Station,
} from "../../../generated/prisma/client.js";
import { ApiError } from "../../utils/api-error.js";
import { PaginationQueryParams } from "../pagination/pagination.dto.js";
import { BeginJobProcessingDto } from "./dto/beginJobProcessing.dto.js";
import { GetActiveJobsDto } from "./dto/getActiveJobs.dto.js";
import { GetAvailableJobsDto } from "./dto/getAvailableJobs.dto.js";
import { GetJobHistoryDto } from "./dto/getJobHistory.dto.js";

export class WorkerService {
  constructor(private prisma: PrismaClient) {}

  fetchJobs = async (
    whereClause: Prisma.OrderJobWhereInput,
    { page, take, sortBy, sortOrder }: PaginationQueryParams,
  ) => {
    const jobs = await this.prisma.orderJob.findMany({
      where: whereClause,
      take,
      skip: (page - 1) * take,
      orderBy: { [sortBy]: sortOrder },
      select: {
        jobId: true,
        station: true,
        createdAt: true,
        startTime: true,
        endTime: true,
        order: {
          select: {
            orderItems: {
              select: {
                id: true,
                name: true,
                quantity: true,
              },
            },
          },
        },
      },
    });

    const denestedJobs = jobs.map((job) => ({
      jobId: job.jobId,
      station: job.station,
      createdAt: job.createdAt,
      startTime: job.startTime,
      endTime: job.endTime,
      orderItems: job.order.orderItems.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
      })),
    }));

    const total = await this.prisma.orderJob.count({
      where: whereClause,
    });

    return { data: denestedJobs, meta: { page, take, total } };
  };

  getAvailableJobs = async (userId: number, dto: GetAvailableJobsDto) => {
    const worker = await this.prisma.employee.findUnique({
      where: { userId },
    });

    if (!worker) {
      throw new ApiError("Worker not found", 404);
    }

    if (worker.type !== EmployeeType.WORKER) {
      throw new ApiError("Unauthorized access", 403);
    }

    const outlet = await this.prisma.outlet.findUnique({
      where: { id: worker.outletId },
    });

    if (!outlet) {
      throw new ApiError("Outlet not found", 404);
    }

    const whereClause = {
      outletId: outlet.id,
      endTime: null,
      employeeId: null,
    };

    const jobs = await this.fetchJobs(whereClause, dto);

    return jobs;
  };

  getActiveJobs = async (userId: number, dto: GetActiveJobsDto) => {
    const worker = await this.prisma.employee.findUnique({
      where: { userId },
    });

    if (!worker) {
      throw new ApiError("Worker not found", 404);
    }

    if (worker.type !== EmployeeType.WORKER) {
      throw new ApiError("Unauthorized access", 403);
    }

    const whereClause = {
      employeeId: worker.id,
      endTime: null,
      OR: [{ isBypassed: false }, { bypassApproved: true }],
    };

    const jobs = await this.fetchJobs(whereClause, dto);

    return jobs;
  };

  getJobHistory = async (userId: number, dto: GetJobHistoryDto) => {
    const worker = await this.prisma.employee.findUnique({
      where: { userId },
    });

    if (!worker) {
      throw new ApiError("Worker not found", 404);
    }

    if (worker.type !== EmployeeType.WORKER) {
      throw new ApiError("Unauthorized access", 403);
    }

    const whereClause = {
      employeeId: worker.id,
      endTime: { not: null },
    };

    const jobs = await this.fetchJobs(whereClause, dto);

    return jobs;
  };

  beginJobProcessing = async (
    userId: number,
    { jobId, items }: BeginJobProcessingDto,
  ) => {
    const result = await this.prisma.$transaction(async (tx) => {
      const job = await tx.orderJob.findUnique({
        where: { jobId },
        include: { order: true },
      });

      if (!job) {
        throw new ApiError("Job not found", 404);
      }

      const worker = await tx.employee.findUnique({
        where: { userId },
      });

      if (!worker) {
        throw new ApiError("Employee not found", 404);
      }

      if (worker.type !== EmployeeType.WORKER) {
        throw new ApiError("Unauthorized access", 403);
      }

      const existingItems = await tx.orderItem.findMany({
        where: { orderId: job.orderId },
      });

      const mismatch = items.some((input) => {
        const match = existingItems.find((e) => e.id === input.itemId);
        return !match || match.quantity !== input.quantity;
      });

      const updatedJob = await tx.orderJob.update({
        where: { jobId },
        data: {
          employeeId: worker.id,
          startTime: new Date(),
          isBypassed: mismatch,
          bypassApproved: null,
        },
      });

      if (!mismatch) {
        await tx.order.update({
          where: { id: job.orderId },
          data: { orderStatus: job.station },
        });
      }

      return { job: updatedJob, mismatch };
    });

    if (result.mismatch) {
      return {
        message: "Item mismatch flagged. Awaiting admin approval",
      };
    }

    return {
      message: `Job #${jobId} processing started at ${result.job.station} station`,
    };
  };

  finishJobProcessing = async (jobId: string) => {
    const result = await this.prisma.$transaction(async (tx) => {
      const job = await tx.orderJob.update({
        where: { jobId },
        data: { endTime: new Date() },
        include: { order: true },
      });

      if (!job) {
        throw new ApiError("Order job not found", 404);
      }

      let nextStatus: OrderStatus | null = null;
      let nextStation: Station | null = null;
      switch (job.station) {
        case OrderStatus.WASHING:
          nextStatus = OrderStatus.IRONING;
          nextStation = Station.IRONING;
          break;
        case OrderStatus.IRONING:
          nextStatus = OrderStatus.PACKING;
          nextStation = Station.PACKING;
          break;
        case OrderStatus.PACKING:
          nextStatus =
            job.order.paymentStatus !== PaymentStatus.SUCCESS
              ? OrderStatus.WAITING_FOR_PAYMENT
              : OrderStatus.READY_TO_DELIVER;
          break;
      }

      if (nextStatus) {
        await tx.order.update({
          where: { id: job.orderId },
          data: { orderStatus: nextStatus },
        });
      }

      if (nextStatus === OrderStatus.WAITING_FOR_PAYMENT) {
        const paymentNotification = await tx.notification.create({
          data: {
            title: "Payment Required",
            body: `Order #${job.order.orderId} is packed. Please complete your payment to continue.`,
          },
        });

        await tx.notificationsOnUsers.create({
          data: {
            userId: job.order.userId,
            notificationId: paymentNotification.id,
          },
        });
      }

      if (nextStatus === OrderStatus.READY_TO_DELIVER) {
        const orderDelivery = await tx.orderDelivery.create({
          data: {
            orderId: job.orderId,
            outletId: job.outletId,
          },
        });

        const driverNotification = await tx.notification.create({
          data: {
            title: "New Order Created",
            body: `Order #${orderDelivery.deliveryId} ready for pickup`,
          },
        });

        const drivers = await tx.employee.findMany({
          where: {
            outletId: job.order.outletId,
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
      }

      let nextJob = null;
      if (nextStation && job.station !== Station.PACKING) {
        nextJob = await tx.orderJob.create({
          data: {
            orderId: job.orderId,
            outletId: job.order.outletId,
            station: nextStation,
            employeeId: null,
          },
        });
      }

      return { job: nextJob };
    });

    return {
      message: `Job #${jobId} finished successfully`,
      job: result.job,
    };
  };
}
