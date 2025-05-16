/*
  Warnings:

  - Made the column `category` on table `Transaction` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "amount" SET DATA TYPE TEXT,
ALTER COLUMN "category" SET NOT NULL;
