-- AlterTable
ALTER TABLE "order_deliveries" ALTER COLUMN "status" SET DEFAULT 'WAITING_FOR_DRIVER';

-- AlterTable
ALTER TABLE "order_pickups" ALTER COLUMN "status" SET DEFAULT 'WAITING_FOR_DRIVER';
