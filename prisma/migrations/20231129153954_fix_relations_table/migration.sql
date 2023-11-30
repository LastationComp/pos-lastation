/*
  Warnings:

  - You are about to alter the column `expired_at` on the `clients` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- DropForeignKey
ALTER TABLE `customers` DROP FOREIGN KEY `Customers_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `Products_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `selling_units` DROP FOREIGN KEY `selling_units_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `selling_units` DROP FOREIGN KEY `selling_units_unit_id_fkey`;

-- DropForeignKey
ALTER TABLE `transactions` DROP FOREIGN KEY `Transactions_employee_id_fkey`;

-- AlterTable
ALTER TABLE `clients` MODIFY `is_active` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `expired_at` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `customers` MODIFY `created_by` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `employees` ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `products` MODIFY `created_by` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `selling_units` MODIFY `unit_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `transactions` MODIFY `employee_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Customers` ADD CONSTRAINT `Customers_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `Employees`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Products` ADD CONSTRAINT `Products_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `Employees`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `selling_units` ADD CONSTRAINT `selling_units_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `selling_units` ADD CONSTRAINT `selling_units_unit_id_fkey` FOREIGN KEY (`unit_id`) REFERENCES `Units`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employees`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
