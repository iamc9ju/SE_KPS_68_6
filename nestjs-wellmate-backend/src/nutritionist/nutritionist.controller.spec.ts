import { Test, TestingModule } from '@nestjs/testing';
import { NutritionistController } from './nutritionist.controller';
import { NutritionistService } from './nutritionist.service';

describe('NutritionistController', () => {
  let controller: NutritionistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NutritionistController],
      providers: [NutritionistService],
    }).compile();

    controller = module.get<NutritionistController>(NutritionistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
