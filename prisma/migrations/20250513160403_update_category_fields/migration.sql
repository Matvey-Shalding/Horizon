/*
  Warnings:

  - You are about to drop the column `budget` on the `Category` table. All the data in the column will be lost.
  - Added the required column `expenses` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "budget",
ADD COLUMN     "expenses" TEXT NOT NULL;
