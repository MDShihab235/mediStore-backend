/*
  Warnings:

  - Added the required column `paymentType` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingAddress` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('CASH_ON_DELIVERY');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "paymentType" "PaymentType" NOT NULL,
ADD COLUMN     "shippingAddress" TEXT NOT NULL;
