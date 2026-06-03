-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_address_id_fkey";

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "weight" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "user_addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
