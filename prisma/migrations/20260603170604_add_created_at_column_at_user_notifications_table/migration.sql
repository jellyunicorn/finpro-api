/*
  Warnings:

  - The primary key for the `user_notifications` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `deletedAt` on the `user_notifications` table. All the data in the column will be lost.
  - You are about to drop the column `notificationId` on the `user_notifications` table. All the data in the column will be lost.
  - You are about to drop the column `readAt` on the `user_notifications` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `user_notifications` table. All the data in the column will be lost.
  - Added the required column `notification_id` to the `user_notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `user_notifications` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user_notifications" DROP CONSTRAINT "user_notifications_notificationId_fkey";

-- DropForeignKey
ALTER TABLE "user_notifications" DROP CONSTRAINT "user_notifications_userId_fkey";

-- AlterTable
ALTER TABLE "user_notifications" DROP CONSTRAINT "user_notifications_pkey",
DROP COLUMN "deletedAt",
DROP COLUMN "notificationId",
DROP COLUMN "readAt",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "notification_id" INTEGER NOT NULL,
ADD COLUMN     "read_at" TIMESTAMP(3),
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD CONSTRAINT "user_notifications_pkey" PRIMARY KEY ("user_id", "notification_id");

-- AddForeignKey
ALTER TABLE "user_notifications" ADD CONSTRAINT "user_notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_notifications" ADD CONSTRAINT "user_notifications_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "notifications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
