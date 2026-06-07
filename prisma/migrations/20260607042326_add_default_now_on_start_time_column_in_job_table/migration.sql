/*
  Warnings:

  - A unique constraint covering the columns `[job_id]` on the table `order_jobs` will be added. If there are existing duplicate values, this will fail.
  - Made the column `order_id` on table `order_deliveries` required. This step will fail if there are existing NULL values in that column.
  - The required column `job_id` was added to the `order_jobs` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Made the column `order_id` on table `order_jobs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `order_id` on table `order_pickups` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "order_deliveries" DROP CONSTRAINT "order_deliveries_order_id_fkey";

-- DropForeignKey
ALTER TABLE "order_jobs" DROP CONSTRAINT "order_jobs_order_id_fkey";

-- DropForeignKey
ALTER TABLE "order_pickups" DROP CONSTRAINT "order_pickups_order_id_fkey";

-- AlterTable
ALTER TABLE "order_deliveries" ALTER COLUMN "order_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "order_jobs" ADD COLUMN     "job_id" TEXT NOT NULL,
ALTER COLUMN "start_time" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "order_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "order_pickups" ALTER COLUMN "order_id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "order_jobs_job_id_key" ON "order_jobs"("job_id");

-- AddForeignKey
ALTER TABLE "order_jobs" ADD CONSTRAINT "order_jobs_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_pickups" ADD CONSTRAINT "order_pickups_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_deliveries" ADD CONSTRAINT "order_deliveries_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
