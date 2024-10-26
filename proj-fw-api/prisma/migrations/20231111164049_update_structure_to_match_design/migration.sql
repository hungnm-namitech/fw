/*
  Warnings:

  - You are about to drop the column `changeOrderId` on the `order_actions` table. All the data in the column will be lost.
  - The primary key for the `products` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `productCd` on the `products` table. All the data in the column will be lost.
  - You are about to alter the column `tel` on the `suppliers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(128)` to `VarChar(13)`.
  - You are about to alter the column `post_cd` on the `suppliers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(128)` to `VarChar(7)`.
  - Added the required column `product_cd` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `order_actions` DROP FOREIGN KEY `order_actions_changeOrderId_fkey`;

-- DropForeignKey
ALTER TABLE `product_details` DROP FOREIGN KEY `product_details_product_cd_fkey`;

-- DropForeignKey
ALTER TABLE `product_prices` DROP FOREIGN KEY `product_prices_product_cd_fkey`;

-- AlterTable
ALTER TABLE `bases` MODIFY `tel_number` VARCHAR(13) NOT NULL;

-- AlterTable
ALTER TABLE `order_actions` DROP COLUMN `changeOrderId`,
    ADD COLUMN `change_order_id` BIGINT NULL;

-- AlterTable
ALTER TABLE `products` RENAME COLUMN `productCd` TO `product_cd`;

-- AlterTable
ALTER TABLE `suppliers` MODIFY `tel` VARCHAR(13) NULL,
    MODIFY `post_cd` VARCHAR(7) NULL,
    MODIFY `address1` VARCHAR(256) NULL,
    MODIFY `address2` VARCHAR(256) NULL,
    MODIFY `address3` VARCHAR(256) NULL;

-- AddForeignKey
ALTER TABLE `product_details` ADD CONSTRAINT `product_details_product_cd_fkey` FOREIGN KEY (`product_cd`) REFERENCES `products`(`product_cd`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_prices` ADD CONSTRAINT `product_prices_product_cd_fkey` FOREIGN KEY (`product_cd`) REFERENCES `products`(`product_cd`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_actions` ADD CONSTRAINT `order_actions_change_order_id_fkey` FOREIGN KEY (`change_order_id`) REFERENCES `change_order_headers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
