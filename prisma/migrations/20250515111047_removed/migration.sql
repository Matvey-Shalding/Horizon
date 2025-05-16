/*
  Warnings:

  - You are about to drop the column `expenses` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the `_CategoryToTransaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CategoryToTransaction" DROP CONSTRAINT "_CategoryToTransaction_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToTransaction" DROP CONSTRAINT "_CategoryToTransaction_B_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "expenses",
ADD COLUMN     "budget" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "message" TEXT,
ALTER COLUMN "date" SET DATA TYPE TEXT,
ALTER COLUMN "category" DROP NOT NULL;

-- DropTable
DROP TABLE "_CategoryToTransaction";
