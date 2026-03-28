import { Test, TestingModule } from '@nestjs/testing';
import { NutritionOrdersService } from './nutrition-orders.service';

describe('NutritionOrdersService', () => {
  let service: NutritionOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NutritionOrdersService],
    }).compile();

    service = module.get<NutritionOrdersService>(NutritionOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
