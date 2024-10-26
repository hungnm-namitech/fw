import { Test, TestingModule } from '@nestjs/testing';
import { CommercialFlowsController } from './commercial-flows.controller';

describe('CommercialFlowsController', () => {
  let controller: CommercialFlowsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommercialFlowsController],
    }).compile();

    controller = module.get<CommercialFlowsController>(CommercialFlowsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
