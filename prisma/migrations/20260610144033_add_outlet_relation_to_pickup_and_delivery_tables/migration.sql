/*
  Warnings:

  - Added the required column `outlet_id` to the `order_deliveries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outlet_id` to the `order_pickups` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order_deliveries" ADD COLUMN     "outlet_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "order_pickups" ADD COLUMN     "outlet_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "order_pickups" ADD CONSTRAINT "order_pickups_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_deliveries" ADD CONSTRAINT "order_deliveries_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
