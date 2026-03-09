import { Test, TestingModule } from '@nestjs/testing';
import { HealthMetricsController } from './health-metrics.controller';
import { HealthMetricsService } from './health-metrics.service';

describe('HealthMetricsController', () => {
  let controller: HealthMetricsController;

  const mockHealthMetricsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findLatest: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthMetricsController],
      providers: [
        { provide: HealthMetricsService, useValue: mockHealthMetricsService },
      ],
    }).compile();

    controller = module.get<HealthMetricsController>(HealthMetricsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
