/*
  Warnings:

  - You are about to drop the column `delivery_number` on the `order_deliveries` table. All the data in the column will be lost.
  - You are about to drop the column `pickup_number` on the `order_pickups` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[delivery_id]` on the table `order_deliveries` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pickup_id]` on the table `order_pickups` will be added. If there are existing duplicate values, this will fail.
  - The required column `delivery_id` was added to the `order_deliveries` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `pickup_id` was added to the `order_pickups` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "order_deliveries" DROP CONSTRAINT "order_deliveries_driver_id_fkey";

-- DropForeignKey
ALTER TABLE "order_pickups" DROP CONSTRAINT "order_pickups_driver_id_fkey";

-- DropIndex
DROP INDEX "order_deliveries_delivery_number_key";

-- DropIndex
DROP INDEX "order_pickups_pickup_number_key";

-- AlterTable
ALTER TABLE "order_deliveries" DROP COLUMN "delivery_number",
ADD COLUMN     "delivery_id" TEXT NOT NULL,
ALTER COLUMN "driver_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "order_pickups" DROP COLUMN "pickup_number",
ADD COLUMN     "pickup_id" TEXT NOT NULL,
ALTER COLUMN "driver_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "order_deliveries_delivery_id_key" ON "order_deliveries"("delivery_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_pickups_pickup_id_key" ON "order_pickups"("pickup_id");

-- AddForeignKey
ALTER TABLE "order_pickups" ADD CONSTRAINT "order_pickups_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_deliveries" ADD CONSTRAINT "order_deliveries_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
