import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StaffsModule } from './staffs/staffs.module';
import { BasesModule } from './bases/bases.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BcryptModule } from 'src/shared/bcrypt/bcrypt.module';
import { EmailModule } from 'src/mailer/email.module';
import { RolesModule } from './roles/roles.module';
import { CompaniesModule } from './companies/companies.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { ConfigModule } from '@nestjs/config';
import { NewsModule } from './news/news.module';
import { ItemGroupsModule } from './products/products.module';
import { DivValuesModule } from './div-values/div-values.module';
import { OrdersModule } from './orders/orders.module';
import { ProductDetailsModule } from './product-details/product-details.module';
import { SeederModule } from './seeder/seeder.module';
import { CommercialFlowsModule } from './commercial-flows/commercial-flows.module';
import configuration from './config/index';
import { CommercialFlowsService } from './commercial-flows/commercial-flows.service';
import { ProductPricesModule } from './product-prices/product-prices.module';
import { ItemModule } from './item/item.module';
import { HttpModule } from '@nestjs/axios';
import { SchedulersModule } from './schedulers/schedulers.module';
import { StorageModule } from './storage/storage.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    StaffsModule,
    BasesModule,
    PrismaModule,
    BcryptModule,
    EmailModule,
    RolesModule,
    CompaniesModule,
    SuppliersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    NewsModule,
    ItemGroupsModule,
    DivValuesModule,
    OrdersModule,
    ProductDetailsModule,
    SeederModule,
    CommercialFlowsModule,
    ProductPricesModule,
    ItemModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    StorageModule,
    SchedulersModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, CommercialFlowsService],
})
export class AppModule {}
