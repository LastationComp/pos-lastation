/*
  Warnings:

  - You are about to alter the column `expired_at` on the `clients` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `admins` MODIFY `pin` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `clients` MODIFY `expired_at` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `employees` MODIFY `pin` VARCHAR(191) NOT NULL;
