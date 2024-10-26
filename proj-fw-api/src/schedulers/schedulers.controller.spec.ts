import { Test, TestingModule } from '@nestjs/testing';
import { SchedulersController } from './schedulers.controller';

describe('SchedulerController', () => {
  let controller: SchedulersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchedulersController],
    }).compile();

    controller = module.get<SchedulersController>(SchedulersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
