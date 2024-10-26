import { Module } from '@nestjs/common';
import { StaffsService } from './staffs.service';
import { StaffsController } from './staffs.controller';
import { CompaniesModule } from 'src/companies/companies.module';
import { SuppliersModule } from 'src/suppliers/suppliers.module';
// import { EmailModule } from 'src/mailer/email.module';
// import { CreateUserMailTemplateStrategy } from 'src/mailer/template/create-user';
// import { PasswordCreationMailTemplateStrategy } from 'src/mailer/template/password-creation';
// import { UpdateUserMailTemplateStrategy } from 'src/mailer/template/update-user';

@Module({
  imports: [CompaniesModule, SuppliersModule],
  providers: [
    StaffsService,
    // PasswordCreationMailTemplateStrategy,
    // UpdateUserMailTemplateStrategy,
    // CreateUserMailTemplateStrategy,
  ],
  exports: [StaffsService],
  controllers: [StaffsController],
})
export class StaffsModule {}
