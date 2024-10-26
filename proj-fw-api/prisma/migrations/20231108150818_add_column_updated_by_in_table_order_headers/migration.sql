-- AlterTable
ALTER TABLE `order_headers` ADD COLUMN `updated_by` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `order_headers` ADD CONSTRAINT `order_headers_updated_by_fkey` FOREIGN KEY (`updated_by`) REFERENCES `users`(`m_user_id`) ON DELETE SET NULL ON UPDATE CASCADE;
