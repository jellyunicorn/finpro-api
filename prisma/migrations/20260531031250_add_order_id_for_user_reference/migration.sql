/*
  Warnings:

  - A unique constraint covering the columns `[order_id]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - The required column `order_id` was added to the `orders` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "order_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_id_key" ON "orders"("order_id");
