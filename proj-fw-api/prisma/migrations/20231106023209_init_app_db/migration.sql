-- CreateTable
CREATE TABLE `users` (
    `m_user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(50) NOT NULL,
    `user_name` VARCHAR(128) NOT NULL,
    `user_name_kana` VARCHAR(128) NULL,
    `mail_address` VARCHAR(256) NULL,
    `tel` VARCHAR(13) NULL,
    `role_div` CHAR(2) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `company_cd` CHAR(4) NULL,
    `supplier_cd` CHAR(2) NULL,

    UNIQUE INDEX `users_user_id_key`(`user_id`),
    UNIQUE INDEX `users_mail_address_key`(`mail_address`),
    PRIMARY KEY (`m_user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `companies` (
    `company_cd` CHAR(4) NOT NULL,
    `company_nm` VARCHAR(128) NOT NULL,
    `company_div` CHAR(2) NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`company_cd`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `staffs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `staff_name` VARCHAR(128) NOT NULL,
    `staff_name_kana` VARCHAR(128) NULL,
    `company_cd` CHAR(4) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `suppliers` (
    `supplier_cd` CHAR(2) NOT NULL,
    `supplier_name` VARCHAR(128) NOT NULL,
    `supplier_name_kana` VARCHAR(128) NULL,
    `tel` VARCHAR(128) NULL,
    `post_cd` VARCHAR(128) NULL,
    `address1` VARCHAR(128) NULL,
    `address2` VARCHAR(128) NULL,
    `address3` VARCHAR(128) NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`supplier_cd`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `news` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(400) NOT NULL,
    `description` VARCHAR(2000) NOT NULL,
    `publication_start_date` DATETIME(3) NOT NULL,
    `publication_end_date` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `items` (
    `item_cd` CHAR(2) NOT NULL,
    `item_name` VARCHAR(128) NOT NULL,
    `icon_file_name` VARCHAR(255) NULL,
    `display_div` CHAR(2) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`item_cd`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `productCd` CHAR(7) NOT NULL,
    `product_name` VARCHAR(128) NULL,
    `product_display_name` VARCHAR(128) NULL,
    `supplier_cd` CHAR(2) NULL,
    `item_cd` CHAR(2) NULL,
    `product_id` INTEGER NULL,
    `grade_strength` VARCHAR(128) NULL,
    `trailer` VARCHAR(128) NULL,
    `memo` VARCHAR(128) NULL,
    `capacity_min` VARCHAR(128) NULL,
    `capacity_max` VARCHAR(128) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`productCd`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_details` (
    `product_detail_cd` VARCHAR(20) NOT NULL,
    `product_cd` CHAR(7) NOT NULL,
    `width` INTEGER NOT NULL,
    `thickness` INTEGER NOT NULL,
    `length` VARCHAR(10) NOT NULL,
    `quantity_per_pack` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`product_detail_cd`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_prices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_cd` CHAR(7) NOT NULL,
    `unit_div` CHAR(2) NULL,
    `unit_price` FLOAT NOT NULL,
    `start_date` DATE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_headers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `item_cd` CHAR(2) NOT NULL,
    `supplier_cd` CHAR(2) NOT NULL,
    `vehicle_class_div` CHAR(2) NULL,
    `destination_id` INTEGER NULL,
    `trading_company` VARCHAR(128) NULL,
    `mixed_loading_flag` BOOLEAN NULL,
    `requested_deadline` DATE NULL,
    `reply_deadline` DATE NULL,
    `company_cd` CHAR(4) NOT NULL,
    `staff_id` INTEGER NULL,
    `status_div` CHAR(2) NOT NULL,
    `order_quantity` DOUBLE NOT NULL,
    `order_amount` INTEGER NULL,
    `temporary_flag` BOOLEAN NULL,
    `memo` VARCHAR(2000) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NOT NULL,
    `product_detail_cd` VARCHAR(20) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_actions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NOT NULL,
    `action_div` CHAR(2) NOT NULL,
    `status_div` CHAR(2) NOT NULL,
    `user_nm` VARCHAR(128) NOT NULL,
    `company_name` VARCHAR(128) NOT NULL,
    `action_datetime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `memo` VARCHAR(2000) NULL,
    `confirmed_flag` BOOLEAN NULL,
    `close_flag` BOOLEAN NOT NULL,
    `change_deadline` DATE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `changeOrderId` BIGINT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `change_order_headers` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NOT NULL,
    `item_cd` CHAR(2) NOT NULL,
    `supplier_cd` CHAR(2) NOT NULL,
    `vehicle_class_div` CHAR(2) NULL,
    `destination_id` INTEGER NULL,
    `trading_company` VARCHAR(128) NULL,
    `mixed_loading_flag` BOOLEAN NULL,
    `requested_deadline` DATE NULL,
    `reply_deadline` DATE NULL,
    `company_cd` CHAR(4) NOT NULL,
    `staff_id` INTEGER NULL,
    `status_div` CHAR(2) NULL,
    `order_quantity` DOUBLE NULL,
    `order_amount` INTEGER NULL,
    `temporary_flag` BOOLEAN NULL,
    `memo` VARCHAR(2000) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `change_order_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` BIGINT NOT NULL,
    `product_detail_cd` VARCHAR(20) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `orderHeaderId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `commercial_flows` (
    `commercialFlowCd` CHAR(8) NOT NULL,
    `item_cd` CHAR(2) NULL,
    `supplier_cd` CHAR(2) NOT NULL,
    `company_cd` CHAR(4) NOT NULL,
    `monthly_forecast` INTEGER NULL,
    `trading_company_1` VARCHAR(128) NULL,
    `trading_company_2` VARCHAR(128) NULL,
    `trading_company_3` VARCHAR(128) NULL,
    `trading_company_4` VARCHAR(128) NULL,
    `delivery_destination_1` VARCHAR(128) NULL,
    `delivery_destination_2` VARCHAR(128) NULL,
    `delivery_destination_3` VARCHAR(128) NULL,
    `delivery_destination_4` VARCHAR(128) NULL,
    `delivery_destination_5` VARCHAR(128) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`commercialFlowCd`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bases` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `base_name` VARCHAR(128) NOT NULL,
    `base_name_kana` VARCHAR(128) NULL,
    `base_div` CHAR(2) NOT NULL,
    `tel_number` VARCHAR(11) NOT NULL,
    `post_cd` CHAR(7) NOT NULL,
    `address1` VARCHAR(256) NULL,
    `address2` VARCHAR(256) NULL,
    `address3` VARCHAR(256) NULL,
    `entry_vehicle_limit` VARCHAR(256) NULL,
    `company_cd` CHAR(4) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `div_values` (
    `div_cd` VARCHAR(5) NOT NULL,
    `div_value` CHAR(2) NOT NULL,
    `div_value_nm` VARCHAR(128) NOT NULL,

    PRIMARY KEY (`div_cd`, `div_value`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_company_cd_fkey` FOREIGN KEY (`company_cd`) REFERENCES `companies`(`company_cd`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_supplier_cd_fkey` FOREIGN KEY (`supplier_cd`) REFERENCES `suppliers`(`supplier_cd`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `staffs` ADD CONSTRAINT `staffs_company_cd_fkey` FOREIGN KEY (`company_cd`) REFERENCES `companies`(`company_cd`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_supplier_cd_fkey` FOREIGN KEY (`supplier_cd`) REFERENCES `suppliers`(`supplier_cd`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_item_cd_fkey` FOREIGN KEY (`item_cd`) REFERENCES `items`(`item_cd`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_details` ADD CONSTRAINT `product_details_product_cd_fkey` FOREIGN KEY (`product_cd`) REFERENCES `products`(`productCd`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_prices` ADD CONSTRAINT `product_prices_product_cd_fkey` FOREIGN KEY (`product_cd`) REFERENCES `products`(`productCd`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_headers` ADD CONSTRAINT `order_headers_item_cd_fkey` FOREIGN KEY (`item_cd`) REFERENCES `items`(`item_cd`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_headers` ADD CONSTRAINT `order_headers_supplier_cd_fkey` FOREIGN KEY (`supplier_cd`) REFERENCES `suppliers`(`supplier_cd`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_headers` ADD CONSTRAINT `order_headers_company_cd_fkey` FOREIGN KEY (`company_cd`) REFERENCES `companies`(`company_cd`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_headers` ADD CONSTRAINT `order_headers_staff_id_fkey` FOREIGN KEY (`staff_id`) REFERENCES `staffs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_headers` ADD CONSTRAINT `order_headers_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`m_user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_details` ADD CONSTRAINT `order_details_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `order_headers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_details` ADD CONSTRAINT `order_details_product_detail_cd_fkey` FOREIGN KEY (`product_detail_cd`) REFERENCES `product_details`(`product_detail_cd`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_actions` ADD CONSTRAINT `order_actions_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `order_headers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_actions` ADD CONSTRAINT `order_actions_changeOrderId_fkey` FOREIGN KEY (`changeOrderId`) REFERENCES `change_order_headers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `change_order_headers` ADD CONSTRAINT `change_order_headers_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `order_headers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `change_order_headers` ADD CONSTRAINT `change_order_headers_item_cd_fkey` FOREIGN KEY (`item_cd`) REFERENCES `items`(`item_cd`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `change_order_headers` ADD CONSTRAINT `change_order_headers_supplier_cd_fkey` FOREIGN KEY (`supplier_cd`) REFERENCES `suppliers`(`supplier_cd`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `change_order_headers` ADD CONSTRAINT `change_order_headers_company_cd_fkey` FOREIGN KEY (`company_cd`) REFERENCES `companies`(`company_cd`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `change_order_headers` ADD CONSTRAINT `change_order_headers_staff_id_fkey` FOREIGN KEY (`staff_id`) REFERENCES `staffs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `change_order_details` ADD CONSTRAINT `change_order_details_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `change_order_headers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `change_order_details` ADD CONSTRAINT `change_order_details_product_detail_cd_fkey` FOREIGN KEY (`product_detail_cd`) REFERENCES `product_details`(`product_detail_cd`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `change_order_details` ADD CONSTRAINT `change_order_details_orderHeaderId_fkey` FOREIGN KEY (`orderHeaderId`) REFERENCES `order_headers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `commercial_flows` ADD CONSTRAINT `commercial_flows_item_cd_fkey` FOREIGN KEY (`item_cd`) REFERENCES `items`(`item_cd`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `commercial_flows` ADD CONSTRAINT `commercial_flows_supplier_cd_fkey` FOREIGN KEY (`supplier_cd`) REFERENCES `suppliers`(`supplier_cd`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `commercial_flows` ADD CONSTRAINT `commercial_flows_company_cd_fkey` FOREIGN KEY (`company_cd`) REFERENCES `companies`(`company_cd`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bases` ADD CONSTRAINT `bases_company_cd_fkey` FOREIGN KEY (`company_cd`) REFERENCES `companies`(`company_cd`) ON DELETE RESTRICT ON UPDATE CASCADE;
