/*
  Warnings:

  - You are about to drop the `samples` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'DRIVER', 'WORKER', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('GOOGLE', 'APPLE', 'CREDENTIALS');

-- DropTable
DROP TABLE "samples";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "birth_date" TIMESTAMP(3),
    "phone" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "avatar" TEXT,
    "full_name" TEXT NOT NULL,
    "provider" "Provider" NOT NULL DEFAULT 'CREDENTIALS',
    "verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
