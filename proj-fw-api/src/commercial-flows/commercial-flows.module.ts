import { Module } from '@nestjs/common';
import { CommercialFlowsService } from './commercial-flows.service';
import { CommercialFlowsController } from './commercial-flows.controller';

@Module({
  providers: [CommercialFlowsService],
  controllers: [CommercialFlowsController]
})
export class CommercialFlowsModule {}
