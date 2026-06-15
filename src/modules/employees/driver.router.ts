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
      "/pickup-history",
      this.authMiddleware.verifyToken,
      this.authMiddleware.verifyRole([Role.DRIVER]),
      this.driverController.getPickupHistory,
    );

    this.router.get(
      "/delivery-history",
      this.authMiddleware.verifyToken,
      this.authMiddleware.verifyRole([Role.DRIVER]),
      this.driverController.getDeliveryHistory,
    );

    this.router.get(
      "/available-pickups",
      this.authMiddleware.verifyToken,
      this.authMiddleware.verifyRole([Role.DRIVER]),
      this.driverController.getAvailablePickups,
    );

    this.router.get(
      "/available-deliveries",
      this.authMiddleware.verifyToken,
      this.authMiddleware.verifyRole([Role.DRIVER]),
      this.driverController.getAvailableDeliveries,
    );

    this.router.patch(
      "/pickup/:id/assign",
      this.authMiddleware.verifyToken,
      this.authMiddleware.verifyRole([Role.DRIVER]),
      this.driverController.assignPickup,
    );

    this.router.patch(
      "/delivery/:id/assign",
      this.authMiddleware.verifyToken,
      this.authMiddleware.verifyRole([Role.DRIVER]),
      this.driverController.assignDelivery,
    );

    this.router.patch(
      "/pickup/:id/next",
      this.authMiddleware.verifyToken,
      this.authMiddleware.verifyRole([Role.DRIVER]),
      this.driverController.advancePickupStatus,
    );

    this.router.patch(
      "/delivery/:id/next",
      this.authMiddleware.verifyToken,
      this.authMiddleware.verifyRole([Role.DRIVER]),
      this.driverController.advanceDeliveryStatus,
    );

    this.router.patch(
      "/pickup/:id/finish",
      this.authMiddleware.verifyToken,
      this.authMiddleware.verifyRole([Role.DRIVER]),
      this.driverController.finishPickup,
    );

    this.router.patch(
      "/delivery/:id/finish",
      this.authMiddleware.verifyToken,
      this.authMiddleware.verifyRole([Role.DRIVER]),
      this.driverController.finishDelivery,
    );

    this.router.patch(
      "/pickup/:id/cancel",
      this.authMiddleware.verifyToken,
      this.authMiddleware.verifyRole([Role.DRIVER]),
      this.driverController.cancelPickup,
    );

    this.router.patch(
      "/delivery/:id/cancel",
      this.authMiddleware.verifyToken,
      this.authMiddleware.verifyRole([Role.DRIVER]),
      this.driverController.cancelDelivery,
    );
  };

  getRouter = () => {
    return this.router;
  };
}
