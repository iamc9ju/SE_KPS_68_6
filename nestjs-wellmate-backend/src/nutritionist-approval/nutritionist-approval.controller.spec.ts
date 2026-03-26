import { Test, TestingModule } from '@nestjs/testing';
import { NutritionistApprovalController } from './nutritionist-approval.controller';
import { NutritionistApprovalService } from './nutritionist-approval.service';

describe('NutritionistApprovalController', () => {
  let controller: NutritionistApprovalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NutritionistApprovalController],
      providers: [NutritionistApprovalService],
    }).compile();

    controller = module.get<NutritionistApprovalController>(NutritionistApprovalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
