import { Test, TestingModule } from '@nestjs/testing';
import { ProductDetailService } from './product-details.service';

describe('ItemDetailsService', () => {
  let service: ProductDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductDetailService],
    }).compile();

    service = module.get<ProductDetailService>(ProductDetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
