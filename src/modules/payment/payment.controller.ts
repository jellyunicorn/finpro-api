import { Request, Response } from "express";
import { PaymentService } from "./payment.service.js";

export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  createPaymentSession = async (req: Request, res: Response) => {
    const userId = res.locals.user.id;
    const orderId = req.params.orderid;
    const result = await this.paymentService.createPaymentSession(
      orderId,
      userId,
    );
    res.status(200).send(result);
  };
}
