import { Test, TestingModule } from '@nestjs/testing';
import { DivValuesController } from './div-values.controller';

describe('DivValuesController', () => {
  let controller: DivValuesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DivValuesController],
    }).compile();

    controller = module.get<DivValuesController>(DivValuesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
