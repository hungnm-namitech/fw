import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ProductService } from 'src/products/products.service';
import { ProductDetailService } from 'src/product-details/product-details.service';
import { CompaniesService } from 'src/companies/companies.service';
import { SuppliersService } from 'src/suppliers/suppliers.service';

@Module({
  providers: [
    OrdersService,
    ProductService,
    ProductDetailService,
    CompaniesService,
    SuppliersService,
  ],
  controllers: [OrdersController],
})
export class OrdersModule {}
