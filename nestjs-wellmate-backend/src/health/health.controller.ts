import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { CustomPrismaHealthIndicator } from './custom-prisma.health';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private customPrismaHealth: CustomPrismaHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'ตรวจเช็คสถานะ Database และ Server' })
  check() {
    return this.health.check([
      () => this.customPrismaHealth.isHealthy('database'),
    ]);
  }
}
