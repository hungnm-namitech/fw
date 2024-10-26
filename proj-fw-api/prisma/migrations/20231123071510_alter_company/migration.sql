/*
  Warnings:

  - You are about to alter the column `requested_deadline` on the `change_order_headers` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `reply_deadline` on the `change_order_headers` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `change_deadline` on the `order_actions` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `requested_deadline` on the `order_headers` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `reply_deadline` on the `order_headers` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `start_date` on the `product_prices` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `companies` ADD COLUMN `address1` VARCHAR(256) NULL,
    ADD COLUMN `address2` VARCHAR(256) NULL,
    ADD COLUMN `address3` VARCHAR(256) NULL,
    ADD COLUMN `company_name_kana` VARCHAR(128) NULL,
    ADD COLUMN `post_cd` VARCHAR(7) NULL,
    ADD COLUMN `tel` VARCHAR(13) NULL;
