import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/auth.middleware.js";
import { ValidationMiddleware } from "../../middlewares/validation.middleware.js";
import { PaymentController } from "./payment.controller.js";

export class PaymentRouter {
  private router: Router;

  constructor(
    private paymentController: PaymentController,
    private authMiddleware: AuthMiddleware,

    private validationMiddleware: ValidationMiddleware,
  ) {
    this.router = Router();
    this.initializedRoutes();
  }

  private initializedRoutes = () => {
    this.router.post(
      "/:orderid",
      this.authMiddleware.verifyToken,
      this.paymentController.createPaymentSession,
    );
    this.router.post(
      "/webhooks/xendit",
      this.paymentController.handleXenditWebhook,
    );
  };

  getRouter = () => {
    return this.router;
  };
}
