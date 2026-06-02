import { PrismaClient } from "../../../generated/prisma/client.js";
import { ApiError } from "../../utils/api-error.js";

type neworder = {
  pickupaddressid: number;
  outletid: number;
  pickupDate: string;
  pickupTime: string;
  distance: number;
};
export class OrderServices {
  constructor(private prisma: PrismaClient) {}

  getOrders = async (id: number) => {
    return await this.prisma.order.findMany({ where: { userId: id } });
  };

  addNewOrder = async (body: neworder, id: number) => {
    const checkoutlet = await this.prisma.outlet.findUnique({
      where: { id: body.outletid },
    });

    if (!checkoutlet) {
      throw new ApiError("outlet does not exist", 404);
    }

    const address = await this.prisma.userAddress.findFirst({
      where: { id: body.pickupaddressid, userId: id, deletedAt: null },
    });
    if (!address) throw new ApiError("Pickup address not found", 404);

    const res = await this.prisma.order.create({
      data: {
        scheduledTime: new Date(`${body.pickupDate}T${body.pickupTime}`),
        orderStatus: "WAITING_FOR_PAYMENT",
        deliveryCost: 0,
        paymentStatus: "PENDING",
        distance: body.distance,
        userId: id,
        outletId: body.outletid,
        addressId: body.pickupaddressid,
      },
    });

    return { message: "new order created" };
  };
}
