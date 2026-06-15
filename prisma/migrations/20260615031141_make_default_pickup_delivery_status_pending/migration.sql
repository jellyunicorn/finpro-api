/*
  Warnings:

  - The values [OTW_TO_OUTLET] on the enum `DeliveryStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [OTW_TO_CUSTOMER] on the enum `PickupStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DeliveryStatus_new" AS ENUM ('PENDING', 'WAITING_FOR_DRIVER', 'OTW_TO_CUSTOMER', 'ARRIVED_AT_CUSTOMER', 'CANCELLED');
ALTER TABLE "public"."order_deliveries" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "order_deliveries" ALTER COLUMN "status" TYPE "DeliveryStatus_new" USING ("status"::text::"DeliveryStatus_new");
ALTER TYPE "DeliveryStatus" RENAME TO "DeliveryStatus_old";
ALTER TYPE "DeliveryStatus_new" RENAME TO "DeliveryStatus";
DROP TYPE "public"."DeliveryStatus_old";
ALTER TABLE "order_deliveries" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PickupStatus_new" AS ENUM ('PENDING', 'WAITING_FOR_DRIVER', 'OTW_TO_OUTLET', 'ARRIVED_AT_OUTLET', 'CANCELLED');
ALTER TABLE "public"."order_pickups" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "order_pickups" ALTER COLUMN "status" TYPE "PickupStatus_new" USING ("status"::text::"PickupStatus_new");
ALTER TYPE "PickupStatus" RENAME TO "PickupStatus_old";
ALTER TYPE "PickupStatus_new" RENAME TO "PickupStatus";
DROP TYPE "public"."PickupStatus_old";
ALTER TABLE "order_pickups" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "order_deliveries" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "order_pickups" ALTER COLUMN "status" SET DEFAULT 'PENDING';
