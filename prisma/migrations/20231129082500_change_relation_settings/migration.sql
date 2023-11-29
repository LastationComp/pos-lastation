/*
  Warnings:

  - You are about to alter the column `expired_at` on the `clients` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- DropForeignKey
ALTER TABLE `admins` DROP FOREIGN KEY `Admins_client_id_fkey`;

-- DropForeignKey
ALTER TABLE `employees` DROP FOREIGN KEY `Employees_admin_id_fkey`;

-- DropForeignKey
ALTER TABLE `settings` DROP FOREIGN KEY `Settings_admin_id_fkey`;

-- AlterTable
ALTER TABLE `clients` MODIFY `expired_at` TIMESTAMP NOT NULL;

-- AddForeignKey
ALTER TABLE `Admins` ADD CONSTRAINT `Admins_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `Clients`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Settings` ADD CONSTRAINT `Settings_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `Admins`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employees` ADD CONSTRAINT `Employees_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `Admins`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
