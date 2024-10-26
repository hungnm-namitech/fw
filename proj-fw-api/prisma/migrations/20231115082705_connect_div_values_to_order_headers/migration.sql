/*
  Warnings:

  - A unique constraint covering the columns `[div_value]` on the table `div_values` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `div_values_div_value_key` ON `div_values`(`div_value`);

-- AddForeignKey
ALTER TABLE `order_headers` ADD CONSTRAINT `order_headers_vehicle_class_div_fkey` FOREIGN KEY (`vehicle_class_div`) REFERENCES `div_values`(`div_value`) ON DELETE SET NULL ON UPDATE CASCADE;
