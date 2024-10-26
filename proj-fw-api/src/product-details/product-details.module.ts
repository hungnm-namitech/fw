import { Module } from '@nestjs/common';
import { ProductDetailService } from './product-details.service';

@Module({
  providers: [ProductDetailService],
  exports: [ProductDetailService],
})
export class ProductDetailsModule {}
