-- CreateTable
CREATE TABLE `super_admin` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `super_admin_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Clients` (
    `id` VARCHAR(191) NOT NULL,
    `license_key` VARCHAR(191) NOT NULL,
    `client_name` VARCHAR(191) NOT NULL,
    `client_code` VARCHAR(191) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT false,
    `expired_at` TIMESTAMP NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `super_admin_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Clients_license_key_key`(`license_key`),
    UNIQUE INDEX `Clients_client_code_key`(`client_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admins` (
    `id` VARCHAR(191) NOT NULL,
    `pin` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `client_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Admins_username_key`(`username`),
    UNIQUE INDEX `Admins_client_id_key`(`client_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `emp_can_login` BOOLEAN NOT NULL DEFAULT true,
    `emp_can_create` BOOLEAN NOT NULL DEFAULT true,
    `emp_can_update` BOOLEAN NOT NULL DEFAULT true,
    `emp_can_delete` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `admin_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Settings_admin_id_key`(`admin_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Employees` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `pin` INTEGER NOT NULL,
    `employee_code` CHAR(10) NOT NULL,
    `avatar_url` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `admin_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Employees_employee_code_key`(`employee_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Customers` (
    `id` VARCHAR(191) NOT NULL,
    `customer_code` CHAR(10) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(15) NOT NULL,
    `point` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `created_by` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Customers_customer_code_key`(`customer_code`),
    UNIQUE INDEX `Customers_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Products` (
    `id` VARCHAR(191) NOT NULL,
    `barcode` VARCHAR(12) NOT NULL,
    `product_name` VARCHAR(191) NOT NULL,
    `smallest_selling_unit` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `created_by` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Products_barcode_key`(`barcode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Units` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `selling_units` (
    `id` VARCHAR(191) NOT NULL,
    `is_smallest` BOOLEAN NOT NULL DEFAULT false,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `price` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `product_id` VARCHAR(191) NOT NULL,
    `unit_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transactions` (
    `id` VARCHAR(191) NOT NULL,
    `no_ref` VARCHAR(21) NOT NULL,
    `total_price` DECIMAL(65, 30) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `employee_id` VARCHAR(191) NOT NULL,
    `customer_id` VARCHAR(191) NULL,

    UNIQUE INDEX `Transactions_no_ref_key`(`no_ref`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaction_lists` (
    `id` VARCHAR(191) NOT NULL,
    `qty` INTEGER NOT NULL,
    `total_price` DECIMAL(65, 30) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `selling_unit_id` VARCHAR(191) NOT NULL,
    `transaction_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Clients` ADD CONSTRAINT `Clients_super_admin_id_fkey` FOREIGN KEY (`super_admin_id`) REFERENCES `super_admin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Admins` ADD CONSTRAINT `Admins_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `Clients`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Settings` ADD CONSTRAINT `Settings_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `Admins`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employees` ADD CONSTRAINT `Employees_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `Admins`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Customers` ADD CONSTRAINT `Customers_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `Employees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Products` ADD CONSTRAINT `Products_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `Employees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `selling_units` ADD CONSTRAINT `selling_units_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `selling_units` ADD CONSTRAINT `selling_units_unit_id_fkey` FOREIGN KEY (`unit_id`) REFERENCES `Units`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `Customers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction_lists` ADD CONSTRAINT `transaction_lists_selling_unit_id_fkey` FOREIGN KEY (`selling_unit_id`) REFERENCES `selling_units`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction_lists` ADD CONSTRAINT `transaction_lists_transaction_id_fkey` FOREIGN KEY (`transaction_id`) REFERENCES `Transactions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
