import { Test, TestingModule } from '@nestjs/testing';
import { DivValuesService } from './div-values.service';

describe('DivValuesService', () => {
  let service: DivValuesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DivValuesService],
    }).compile();

    service = module.get<DivValuesService>(DivValuesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
