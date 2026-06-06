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

  handleXenditWebhook = async (req: Request, res: Response) => {
    const token = req.header("x-callback-token");
    if (token !== process.env.XENDIT_WEBHOOK_TOKEN) {
      return res.status(401).end();
    }

    try {
      const result = await this.paymentService.handleXenditWebhook(req.body);
      res.status(200).send(result);
    } catch (err) {
      console.error("Xendit webhook processing failed:", err);
    }
  };
}
