import axios from "axios";
import { PrismaClient } from "../../../generated/prisma/client.js";
import { ApiError } from "../../utils/api-error.js";

export class PaymentService {
  private auth: string;

  constructor(private prisma: PrismaClient) {
    this.auth =
      "Basic " +
      Buffer.from(process.env.XENDIT_SECRET_KEY + ":").toString("base64");
  }

  createPaymentSession = async (orderId: string, userId: number) => {
    const order = await this.prisma.order.findFirst({
      where: { orderId, userId, deletedAt: null },
    });

    if (!order) throw new ApiError("Order not found", 404);

    if (order.paymentStatus === "SUCCESS")
      throw new ApiError("Order already paid", 400);

    const orderid = order.id;
    const items = await this.prisma.orderItem.findMany({
      where: { orderId: orderid, deletedAt: null },
      select: {
        price: true,
        quantity: true,
      },
    });

    let amount: number = 0;

    items.forEach((e) => {
      const subtotal = e.price * e.quantity;
      amount = amount + subtotal;
    });
    if (amount === 0)
      throw new ApiError("Order has not finished inputted by worker", 404);
    const res = await fetch("https://api.xendit.co/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: this.auth },
      body: JSON.stringify({
        reference_id: orderId,
        session_type: "PAY",
        mode: "PAYMENT_LINK",
        currency: "IDR",
        amount,
        country: "ID",
        success_return_url: `${process.env.XENDIT_TEST_URL}/orders/${orderId}&success`,
        failure_return_url: `${process.env.XENDIT_TEST_URL}/orders/${orderId}&failed`,
      }),
    });

    if (!res.ok) {
      throw new ApiError(`Xendit error: ${await res.text()}`, res.status);
    }
    const { payment_link_url, payment_session_id } = await res.json();

    await this.prisma.order.update({
      where: { orderId },
      data: { xenditSessionId: payment_session_id },
    });

    return {
      url: payment_link_url,
      sessionId: payment_session_id,
    };
  };

  handleXenditWebhook = async (payload: any) => {
    const { event, data } = payload;

    console.log("[xendit-webhook] event:", event);
    console.log("[xendit-webhook] reference_id:", data?.reference_id);
    console.log("[xendit-webhook] status:", data?.status);

    if (event !== "payment.capture") {
      return { ok: true, ignored: true, reason: "not payment capture event" };
    }

    const order = await this.prisma.order.findFirst({
      where: { orderId: data.reference_id, deletedAt: null },
    });

    if (!order) throw new ApiError("Order not found", 404);

    if (order.paymentStatus === "SUCCESS") {
      return {
        ok: true,
        skipped: true,
        reason: "this transaction already paid",
      };
    }
    await this.prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "SUCCESS",
        paymentMethod: data.channel_code,
        paymentTime: data.updated,
      },
    });

    if (order.orderStatus === "WAITING_FOR_PAYMENT") {
      await this.prisma.order.update({
        where: { id: order.id },
        data: {
          orderStatus: "READY_TO_DELIVER",
        },
      });
    }

    return { ok: true, message: `${order.id} success webhook` };
  };
}
