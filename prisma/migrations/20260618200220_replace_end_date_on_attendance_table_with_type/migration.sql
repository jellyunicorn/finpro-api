/*
  Warnings:

  - You are about to drop the column `end_time` on the `attendances` table. All the data in the column will be lost.
  - Added the required column `type` to the `attendances` table without a default value. This is not possible if the table is not empty.
  - Made the column `start_time` on table `attendances` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "AttendanceType" AS ENUM ('CLOCK_IN', 'CLOCK_OUT');

-- AlterTable
ALTER TABLE "attendances" DROP COLUMN "end_time",
ADD COLUMN     "type" "AttendanceType" NOT NULL,
ALTER COLUMN "start_time" SET NOT NULL;
