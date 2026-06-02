import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/auth.middleware.js";
import { ValidationMiddleware } from "../../middlewares/validation.middleware.js";
import { OrderController } from "./order.controller.js";
import { createOrderDTO } from "./dto/order.dto.js";

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
    this.router.post(
      "/new",
      this.authMiddleware.verifyToken,
      this.validationMiddleware.validateBody(createOrderDTO),
      this.orderController.addNewOrder,
    );
  };

  getRouter = () => {
    return this.router;
  };
}
