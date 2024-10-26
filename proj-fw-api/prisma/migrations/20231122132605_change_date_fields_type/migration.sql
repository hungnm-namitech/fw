/*
  Warnings:

  - You are about to alter the column `requested_deadline` on the `order_headers` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `reply_deadline` on the `order_headers` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `change_order_headers` MODIFY `requested_deadline` DATETIME NULL,
    MODIFY `reply_deadline` DATETIME NULL;

-- AlterTable
ALTER TABLE `order_actions` MODIFY `change_deadline` DATETIME NULL;

-- AlterTable
ALTER TABLE `order_headers` MODIFY `requested_deadline` DATETIME NULL,
    MODIFY `reply_deadline` DATETIME NULL;

-- AlterTable
ALTER TABLE `product_prices` MODIFY `start_date` DATETIME NOT NULL;
