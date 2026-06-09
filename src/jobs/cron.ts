import cron from "node-cron";
import { prisma } from "../lib/prisma.js";

export const startCronJobs = () => {
  // for development - per 10 sec , will change to daily
  cron.schedule("*/10 * * * * *", async () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

    const result = await prisma.order.updateMany({
      where: {
        deliveredAt: { lt: twoDaysAgo },
        orderStatus: "ARRIVED_AT_CUSTOMER",
      },
      data: { orderStatus: "CONFIRMED", confirmedAt: new Date() },
    });
    console.log(`[cron] daily check -- ${result.count} data changes`);
  });
};
