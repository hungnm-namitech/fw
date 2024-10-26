import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/auth/local.strategy';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { EmailModule } from 'src/mailer/email.module';
import { CompaniesModule } from 'src/companies/companies.module';
import { SuppliersModule } from 'src/suppliers/suppliers.module';
import { ResetPasswordMailTemplateStrategy } from 'src/mailer/template/reset-password';
import { ConfigService } from '@nestjs/config';
import { TIME_ALIVE } from 'src/constants/timeExpiration';

@Module({
  imports: [
    CompaniesModule,
    UsersModule,
    PassportModule,
    SuppliersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwtSecret'),
        signOptions: { expiresIn: TIME_ALIVE.ONE_WEEK },
      }),
    }),
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    ResetPasswordMailTemplateStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule { }
