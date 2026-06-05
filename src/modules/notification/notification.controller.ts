import { plainToInstance } from "class-transformer";
import { Request, Response } from "express";
import { GetUserNotificationsDTO } from "./dto/getUserNotifications.dto.js";
import { NotificationService } from "./notification.service.js";

export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  getUserNotifications = async (req: Request, res: Response) => {
    const userId = Number(res.locals.user.id);
    const query = plainToInstance(GetUserNotificationsDTO, {
      ...req.query,
      userId,
    });
    const result = await this.notificationService.getUserNotifications(query);
    res.status(200).send(result);
  };

  markAllAsRead = async (req: Request, res: Response) => {
    const userId = Number(res.locals.user.id);
    const result = await this.notificationService.markAllAsRead(userId);
    res.status(200).send(result);
  };

  markAsRead = async (req: Request, res: Response) => {
    const userId = Number(res.locals.user.id);
    const notificationId = Number(req.params.id);
    const result = await this.notificationService.markAsRead(
      userId,
      notificationId,
    );
    res.status(200).send(result);
  };
}
