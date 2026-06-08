-- AlterTable
ALTER TABLE "order_deliveries" ADD COLUMN     "order_id" INTEGER;

-- AlterTable
ALTER TABLE "order_jobs" ADD COLUMN     "order_id" INTEGER,
ALTER COLUMN "end_time" DROP NOT NULL;

-- AlterTable
ALTER TABLE "order_pickups" ADD COLUMN     "order_id" INTEGER;

-- AddForeignKey
ALTER TABLE "order_jobs" ADD CONSTRAINT "order_jobs_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_pickups" ADD CONSTRAINT "order_pickups_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_deliveries" ADD CONSTRAINT "order_deliveries_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
