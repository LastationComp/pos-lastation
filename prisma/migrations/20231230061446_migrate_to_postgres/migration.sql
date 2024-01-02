-- CreateTable
CREATE TABLE "super_admin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "super_admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clients" (
    "id" TEXT NOT NULL,
    "license_key" TEXT NOT NULL,
    "client_name" TEXT NOT NULL,
    "client_code" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "expired_at" TIMESTAMP(3),
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "super_admin_id" TEXT NOT NULL,

    CONSTRAINT "Clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admins" (
    "id" TEXT NOT NULL,
    "pin" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "client_id" TEXT NOT NULL,

    CONSTRAINT "Admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" SERIAL NOT NULL,
    "emp_can_login" BOOLEAN NOT NULL DEFAULT true,
    "emp_can_create" BOOLEAN NOT NULL DEFAULT true,
    "emp_can_update" BOOLEAN NOT NULL DEFAULT true,
    "emp_can_delete" BOOLEAN NOT NULL DEFAULT true,
    "shop_open_hours" TIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shop_close_hours" TIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "admin_id" TEXT NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employees" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pin" TEXT NOT NULL,
    "employee_code" CHAR(10) NOT NULL,
    "avatar_url" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "admin_id" TEXT NOT NULL,

    CONSTRAINT "Employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customers" (
    "id" TEXT NOT NULL,
    "customer_code" CHAR(10) NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" VARCHAR(15) NOT NULL,
    "point" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,

    CONSTRAINT "Customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Products" (
    "id" TEXT NOT NULL,
    "barcode" VARCHAR(100) NOT NULL,
    "product_name" TEXT NOT NULL,
    "smallest_selling_unit" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Units" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "selling_units" (
    "id" TEXT NOT NULL,
    "is_smallest" BOOLEAN NOT NULL DEFAULT false,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "price" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "product_id" TEXT NOT NULL,
    "unit_id" INTEGER,

    CONSTRAINT "selling_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transactions" (
    "id" TEXT NOT NULL,
    "no_ref" VARCHAR(21) NOT NULL,
    "total_price" DECIMAL(8,2) NOT NULL,
    "pay" DECIMAL(8,2) NOT NULL,
    "change" DECIMAL(8,2) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "employee_id" TEXT,
    "customer_id" TEXT,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_lists" (
    "id" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "total_price" DECIMAL(8,2) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "selling_unit_id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,

    CONSTRAINT "transaction_lists_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "super_admin_username_key" ON "super_admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Clients_license_key_key" ON "Clients"("license_key");

-- CreateIndex
CREATE UNIQUE INDEX "Clients_client_code_key" ON "Clients"("client_code");

-- CreateIndex
CREATE UNIQUE INDEX "Admins_username_key" ON "Admins"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Admins_client_id_key" ON "Admins"("client_id");

-- CreateIndex
CREATE UNIQUE INDEX "Settings_admin_id_key" ON "Settings"("admin_id");

-- CreateIndex
CREATE UNIQUE INDEX "Employees_employee_code_key" ON "Employees"("employee_code");

-- CreateIndex
CREATE UNIQUE INDEX "Customers_customer_code_key" ON "Customers"("customer_code");

-- CreateIndex
CREATE UNIQUE INDEX "Customers_email_key" ON "Customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_no_ref_key" ON "Transactions"("no_ref");

-- AddForeignKey
ALTER TABLE "Clients" ADD CONSTRAINT "Clients_super_admin_id_fkey" FOREIGN KEY ("super_admin_id") REFERENCES "super_admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admins" ADD CONSTRAINT "Admins_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employees" ADD CONSTRAINT "Employees_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customers" ADD CONSTRAINT "Customers_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "Employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "Employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "selling_units" ADD CONSTRAINT "selling_units_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "selling_units" ADD CONSTRAINT "selling_units_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "Units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_lists" ADD CONSTRAINT "transaction_lists_selling_unit_id_fkey" FOREIGN KEY ("selling_unit_id") REFERENCES "selling_units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_lists" ADD CONSTRAINT "transaction_lists_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "Transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
