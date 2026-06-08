-- AlterTable
ALTER TABLE "attendances" ALTER COLUMN "start_time" DROP NOT NULL,
ALTER COLUMN "start_time" DROP DEFAULT;
