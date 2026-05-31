import { Router } from "express";
import { ValidationMiddleware } from "../../middlewares/validation.middleware.js";
import { CreateSampleDTO } from "./dto/create-sample.dto.js";
import { OrderController } from "./order.controller.js";
import { AuthMiddleware } from "../../middlewares/auth.middleware.js";

export class OrderRouter {
  private router: Router;

  constructor(
    private orderController: OrderController,
    private validationMiddleware: ValidationMiddleware,
    private authMiddleware: AuthMiddleware,
  ) {
    this.router = Router();
    this.initializedRoutes();
  }

  private initializedRoutes = () => {
    this.router.get(
      "/",
      this.authMiddleware.verifyToken,
      this.orderController.getOrders,
    );
  };

  getRouter = () => {
    return this.router;
  };
}
