import { Test, TestingModule } from '@nestjs/testing';
import { NutritionAppointmentsService } from './nutrition-appointments.service';

describe('NutritionAppointmentsService', () => {
  let service: NutritionAppointmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NutritionAppointmentsService],
    }).compile();

    service = module.get<NutritionAppointmentsService>(NutritionAppointmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
