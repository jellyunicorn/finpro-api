import { Router } from "express";
import { ValidationMiddleware } from "../../middlewares/validation.middleware.js";
import { NotificationController } from "./notification.controller.js";
import { AuthMiddleware } from "../../middlewares/auth.middleware.js";

export class NotificationRouter {
  private router: Router;

  constructor(
    private notificationController: NotificationController,
    private authMiddleware: AuthMiddleware,
  ) {
    this.router = Router();
    this.initializedRoutes();
  }

  private initializedRoutes = () => {
    this.router.get(
      "/user",
      this.authMiddleware.verifyToken,
      this.notificationController.getUserNotifications,
    );
    this.router.patch(
      "/read-all",
      this.authMiddleware.verifyToken,
      this.notificationController.markAllAsRead,
    );
    this.router.patch(
      "/read/:id",
      this.authMiddleware.verifyToken,
      this.notificationController.markAsRead,
    );
  };

  getRouter = () => {
    return this.router;
  };
}
