import { PrismaClient } from "../../../generated/prisma/client.js";
import { CreateSampleDTO } from "./dto/create-sample.dto.js";

export class OrderServices {
  constructor(private prisma: PrismaClient) {}

  getOrders = async (id: number) => {
    return await this.prisma.order.findMany({ where: { userId: id } });
  };
}
