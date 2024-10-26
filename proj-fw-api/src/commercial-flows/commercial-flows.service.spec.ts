import { Test, TestingModule } from '@nestjs/testing';
import { CommercialFlowsService } from './commercial-flows.service';

describe('CommercialFlowsService', () => {
  let service: CommercialFlowsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommercialFlowsService],
    }).compile();

    service = module.get<CommercialFlowsService>(CommercialFlowsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
