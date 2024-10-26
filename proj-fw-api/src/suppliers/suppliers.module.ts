import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { ItemGroupsModule } from 'src/products/products.module';
import { ProductService } from 'src/products/products.service';

@Module({
  imports: [ItemGroupsModule],
  providers: [SuppliersService, ProductService],
  exports: [SuppliersService],
  controllers: [SuppliersController],
})
export class SuppliersModule {}
