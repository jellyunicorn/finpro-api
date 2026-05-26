/*
  Warnings:

  - Added the required column `label` to the `user_addresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_addresses" ADD COLUMN     "label" TEXT NOT NULL;
