import { Module } from '@nestjs/common';
import { DivValuesService } from './div-values.service';
import { DivValuesController } from './div-values.controller';

@Module({
  providers: [DivValuesService],
  controllers: [DivValuesController],
  exports: [DivValuesService]
})
export class DivValuesModule { }
