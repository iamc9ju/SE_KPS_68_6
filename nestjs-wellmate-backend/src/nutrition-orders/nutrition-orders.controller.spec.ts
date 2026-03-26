import { Test, TestingModule } from '@nestjs/testing';
import { NutritionOrdersController } from './nutrition-orders.controller';
import { NutritionOrdersService } from './nutrition-orders.service';

describe('NutritionOrdersController', () => {
  let controller: NutritionOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NutritionOrdersController],
      providers: [NutritionOrdersService],
    }).compile();

    controller = module.get<NutritionOrdersController>(NutritionOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
