-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "pickup_time" DROP NOT NULL,
ALTER COLUMN "payment_method" DROP NOT NULL,
ALTER COLUMN "payment_time" DROP NOT NULL,
ALTER COLUMN "confirmed_at" DROP NOT NULL,
ALTER COLUMN "delivered_at" DROP NOT NULL;
