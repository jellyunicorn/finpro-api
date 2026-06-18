import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/auth.middleware.js";
import { ValidationMiddleware } from "../../middlewares/validation.middleware.js";
import { OrderController } from "./order.controller.js";
import { CreateOrderDTO } from "./dto/order.dto.js";
import { Role } from "../../../generated/prisma/enums.js";

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
      this.authMiddleware.verifyRole([Role.USER]),
      this.orderController.getOrders,
    );

    this.router.post(
      "/new",
      this.authMiddleware.verifyToken,
      this.authMiddleware.verifyRole([Role.USER]),
      this.validationMiddleware.validateBody(CreateOrderDTO),
      this.orderController.addNewOrder,
    );

    this.router.patch(
      "/confirm/:orderid",
      this.authMiddleware.verifyToken,
      this.authMiddleware.verifyRole([Role.USER]),
      this.orderController.confirmOrder,
    );
    this.router.get(
      "/:orderid",
      this.authMiddleware.verifyToken,
      this.authMiddleware.verifyRole([Role.USER]),
      this.orderController.getOrderDetail,
    );
    this.router.get(
      "/:orderid/total",
      this.authMiddleware.verifyToken,
      this.authMiddleware.verifyRole([Role.USER]),
      this.orderController.getOrderItemsTotal,
    );
    this.router.get(
      "/:orderid/items",
      this.authMiddleware.verifyToken,
      this.authMiddleware.verifyRole([Role.USER]),
      this.orderController.getOrderItems,
    );
  };

  getRouter = () => {
    return this.router;
  };
}
