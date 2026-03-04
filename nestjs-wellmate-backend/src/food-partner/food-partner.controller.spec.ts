import { Test, TestingModule } from '@nestjs/testing';
import { FoodPartnerController } from './food-partner.controller';

describe('FoodPartnerController', () => {
  let controller: FoodPartnerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoodPartnerController],
    }).compile();

    controller = module.get<FoodPartnerController>(FoodPartnerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
