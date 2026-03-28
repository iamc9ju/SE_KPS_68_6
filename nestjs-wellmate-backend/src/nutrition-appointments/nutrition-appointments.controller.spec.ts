import { Test, TestingModule } from '@nestjs/testing';
import { NutritionAppointmentsController } from './nutrition-appointments.controller';
import { NutritionAppointmentsService } from './nutrition-appointments.service';

describe('NutritionAppointmentsController', () => {
  let controller: NutritionAppointmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NutritionAppointmentsController],
      providers: [NutritionAppointmentsService],
    }).compile();

    controller = module.get<NutritionAppointmentsController>(NutritionAppointmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
