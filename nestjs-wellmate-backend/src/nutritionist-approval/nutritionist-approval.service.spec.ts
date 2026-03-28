import { Test, TestingModule } from '@nestjs/testing';
import { NutritionistApprovalService } from './nutritionist-approval.service';

describe('NutritionistApprovalService', () => {
  let service: NutritionistApprovalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NutritionistApprovalService],
    }).compile();

    service = module.get<NutritionistApprovalService>(NutritionistApprovalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
