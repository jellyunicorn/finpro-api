import {
  EmployeeType,
  OrderStatus,
  PaymentStatus,
  PrismaClient,
} from "../../../generated/prisma/client.js";
import { ApiError } from "../../utils/api-error.js";
import { BeginJobProcessingDto } from "./dto/beginJobProcessing.dto.js";
import { GetAvailableJobsDto } from "./dto/getAvailableJobs.dto.js";

export class WorkerService {
  constructor(private prisma: PrismaClient) {}

  getAvailableJobs = async (
    userId: number,
    { page, take, sortBy, sortOrder }: GetAvailableJobsDto,
  ) => {
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

    const jobs = await this.prisma.orderJob.findMany({
      where: whereClause,
      take,
      skip: (page - 1) * take,
      orderBy: { [sortBy]: sortOrder },
      select: {
        jobId: true,
        station: true,
        createdAt: true,
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

  beginJobProcessing = async (userId: number, dto: BeginJobProcessingDto) => {
    const { jobId, items } = dto;

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
          data: { orderStatus: job.station }, // station already stored in job
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
      message: `Job #${dto.jobId} processing started at ${result.job.station} station`,
    };
  };

  finishJobProcessing = async (jobId: number) => {
    const result = await this.prisma.$transaction(async (tx) => {
      const job = await tx.orderJob.update({
        where: { id: jobId },
        data: { endTime: new Date() },
        include: { order: true },
      });

      if (!job || !job.order || !job.orderId) {
        throw new ApiError("Order job not found", 404);
      }

      let nextStatus: OrderStatus | null = null;
      switch (job.station) {
        case OrderStatus.WASHING:
          nextStatus = OrderStatus.IRONING;
          break;
        case OrderStatus.IRONING:
          nextStatus = OrderStatus.PACKING;
          break;
        case OrderStatus.PACKING:
          if (job.order.paymentStatus !== PaymentStatus.SUCCESS) {
            nextStatus = OrderStatus.WAITING_FOR_PAYMENT;
          } else {
            nextStatus = OrderStatus.READY_TO_DELIVER;
          }
          break;
      }

      if (nextStatus) {
        await tx.order.update({
          where: { id: job.orderId },
          data: { orderStatus: nextStatus },
        });
      }

      return { job, nextStatus };
    });

    return {
      message: `Job #${jobId} finished successfully`,
      nextStatus: result.nextStatus,
    };
  };
}
