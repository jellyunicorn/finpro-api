import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/auth.middleware.js";
import { DriverController } from "./driver.controller.js";
import { Role } from "../../../generated/prisma/enums.js";

export class DriverRouter {
  private router: Router;

  constructor(
    private driverController: DriverController,
    private authMiddleware: AuthMiddleware,
  ) {
    this.router = Router();
    this.initializedRoutes();
  }

  private initializedRoutes = () => {
    this.router.get(
      "/active-request",
      this.authMiddleware.verifyToken,
      this.authMiddleware.verifyRole([Role.DRIVER]),
      this.driverController.getActiveRequest,
    );
    this.router.get(
      "/request-history",
      this.authMiddleware.verifyToken,
      this.authMiddleware.verifyRole([Role.DRIVER]),
      this.driverController.getActiveRequest,
    );
    this.router.patch(
      "/pickup",
      this.authMiddleware.verifyToken,
      this.authMiddleware.verifyRole([Role.DRIVER]),
      this.driverController.assignPickup,
    );
    this.router.patch(
      "/delivery",
      this.authMiddleware.verifyToken,
      this.authMiddleware.verifyRole([Role.DRIVER]),
      this.driverController.assignDelivery,
    );
  };

  getRouter = () => {
    return this.router;
  };
}
