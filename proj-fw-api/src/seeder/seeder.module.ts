import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { SeederController } from './seeder.controller';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    JwtModule.register({})
  ],
  controllers: [SeederController],
  providers: [SeederService]
})
export class SeederModule { }
