import { PrismaClient } from "../../../generated/prisma/client.js";
import { ApiError } from "../../utils/api-error.js";
import { GetUserNotificationsDTO } from "./dto/getUserNotifications.dto.js";

export class NotificationService {
  constructor(private prisma: PrismaClient) {}

  getUserNotifications = async ({
    userId,
    page,
    take,
    sortBy,
    sortOrder,
  }: GetUserNotificationsDTO) => {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const whereClause = { userId };

    const notifications = this.prisma.notificationsOnUsers.findMany({
      where: whereClause,
      take,
      skip: (page - 1) * take,
      orderBy: { [sortBy]: sortOrder },
    });

    const total = this.prisma.notificationsOnUsers.count({
      where: whereClause,
    });

    return { data: notifications, meta: { page, take, total } };
  };

  markAllAsRead = async (userId: number) => {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    await this.prisma.notificationsOnUsers.updateMany({
      where: {
        userId,
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });

    return { message: "All notifications marked as read" };
  };

  markAsRead = async (userId: number, notificationId: number) => {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const notification = await this.prisma.notification.findUnique({
      where: {
        id: notificationId,
      },
    });

    if (!notification) {
      throw new ApiError("Notification not found", 404);
    }

    await this.prisma.notificationsOnUsers.updateMany({
      where: {
        userId,
        notificationId,
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });

    return { message: "Notification marked as read" };
  };
}
