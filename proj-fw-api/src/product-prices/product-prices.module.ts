import { Module } from '@nestjs/common';
import { ProductPriceService } from './product-prices.service';
import { ProductPricesController } from './product-prices.controller';

@Module({
  providers: [ProductPriceService],
  controllers: [ProductPricesController],
  exports: [ProductPriceService],
})
export class ProductPricesModule {}
