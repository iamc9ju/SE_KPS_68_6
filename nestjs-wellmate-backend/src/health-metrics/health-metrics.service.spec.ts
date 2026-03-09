import { Test, TestingModule } from '@nestjs/testing';
import { HealthMetricsService } from './health-metrics.service';
import { PrismaService } from '../prisma/prisma.service';

describe('HealthMetricsService', () => {
  let service: HealthMetricsService;

  const mockPrismaService = {
    patient: {
      findUnique: jest.fn(),
    },
    healthMetric: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthMetricsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<HealthMetricsService>(HealthMetricsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // TODO: Add more tests for full coverage (create, findAll, findLatest, findOne, update, remove)
});
