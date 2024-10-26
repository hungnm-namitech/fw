import { Module } from '@nestjs/common';
import { BasesService } from './bases.service';
import { BasesController } from './bases.controller';
import { CompaniesModule } from 'src/companies/companies.module';
import { SuppliersModule } from 'src/suppliers/suppliers.module';

@Module({
  imports: [CompaniesModule, SuppliersModule],
  providers: [
    BasesService,
  ],
  exports: [BasesService],
  controllers: [BasesController],
})
export class BasesModule {}
