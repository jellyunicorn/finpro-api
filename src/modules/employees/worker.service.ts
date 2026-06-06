import {
  EmployeeType,
  OrderStatus,
  PaymentStatus,
  PrismaClient,
} from "../../../generated/prisma/client.js";
import { ApiError } from "../../utils/api-error.js";
import { BeginJobProcessingDto } from "./dto/beginJobProcessing.dto.js";

export class WorkerService {
  constructor(private prisma: PrismaClient) {}

  beginJobProcessing = async (userId: number, dto: BeginJobProcessingDto) => {
    const { orderId, station, items } = dto;

    const result = await this.prisma.$transaction(async (tx) => {
      const existingItems = await tx.orderItem.findMany({
        where: {
          orderId,
        },
      });

      const order = await tx.order.findUnique({
        where: {
          id: orderId,
        },
      });

      if (!order) {
        throw new ApiError("Order not found", 404);
      }

      const worker = await tx.employee.findUnique({
        where: {
          userId,
        },
      });

      if (!worker) {
        throw new ApiError("Employee not found", 404);
      }

      if (worker.type !== EmployeeType.WORKER) {
        throw new ApiError("Unauthorized access", 403);
      }

      const mismatch = items.some((input) => {
        const match = existingItems.find((e) => e.id === input.itemId);
        return !match || match.quantity !== input.quantity;
      });

      const job = await tx.orderJob.create({
        data: {
          orderId,
          employeeId: worker.id,
          outletId: order.outletId,
          station,
          startTime: new Date(),
          isBypassed: mismatch,
          bypassApproved: null,
        },
      });

      if (!mismatch) {
        await tx.order.update({
          where: { id: orderId },
          data: { orderStatus: station },
        });
      }

      return { job, mismatch };
    });

    if (result.mismatch) {
      return {
        message: "Item mismatch flagged. Awaiting admin approval",
      };
    }

    return {
      message: `Order #${dto.orderId} processing started at ${dto.station} station`,
    };
  };

  finishJobProcessing = async (jobId: number) => {
    const result = await this.prisma.$transaction(async (tx) => {
      const job = await tx.orderJob.update({
        where: { id: jobId },
        data: { endTime: new Date() },
        include: { order: true },
      });

      if (!job) {
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
