/*
  Warnings:

  - You are about to drop the column `budget` on the `Category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "budget",
ADD COLUMN     "expenses" TEXT NOT NULL DEFAULT '0';
