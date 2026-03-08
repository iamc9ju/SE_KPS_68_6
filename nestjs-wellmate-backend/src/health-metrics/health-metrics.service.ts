import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHealthMetricDto } from './dto/create-health-metric.dto';
import { UpdateHealthMetricDto } from './dto/update-health-metric.dto';

@Injectable()
export class HealthMetricsService {
  private readonly logger = new Logger(HealthMetricsService.name);

  constructor(private readonly prisma: PrismaService) {}

  private async getPatientId(userId: string): Promise<string> {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
      select: { patientId: true },
    });

    if (!patient) {
      this.logger.warn(`Patient profile not found for user: ${userId}`);
      throw new NotFoundException('ไม่พบโปรไฟล์ผู้ป่วย กรุณาติดต่อผู้ดูแลระบบ');
    }
    return patient.patientId;
  }

  async create(userId: string, dto: CreateHealthMetricDto) {
    const patientId = await this.getPatientId(userId);
    const metric = await this.prisma.healthMetric.create({
      data: {
        patientId,
        weightKg: dto.weightKg,
        heightCm: dto.heightCm,
        bodyFatPercent: dto.bodyFatPercent,
      },
    });

    this.logger.log(
      `Created health metric ${metric.id} for patient ${patientId}`,
    );
    return metric;
  }

  async findAll(userId: string) {
    const patientId = await this.getPatientId(userId);
    return this.prisma.healthMetric.findMany({
      where: { patientId },
      orderBy: { recordedAt: 'desc' },
    });
  }

  async findLatest(userId: string) {
    const patientId = await this.getPatientId(userId);
    const metric = await this.prisma.healthMetric.findFirst({
      where: { patientId },
      orderBy: { recordedAt: 'desc' },
    });

    if (!metric) {
      throw new NotFoundException('ยังไม่มีข้อมูลสุขภาพถูกบันทึกไว้ในระบบ');
    }
    return metric;
  }

  async findOne(userId: string, metricId: number) {
    const patientId = await this.getPatientId(userId);
    const metric = await this.prisma.healthMetric.findUnique({
      where: { id: metricId },
    });

    if (!metric || metric.patientId !== patientId) {
      throw new NotFoundException(
        'ไม่พบข้อมูลสุขภาพที่ระบุ หรือไม่มีสิทธิ์เข้าถึง',
      );
    }
    return metric;
  }

  async update(userId: string, metricId: number, dto: UpdateHealthMetricDto) {
    const patientId = await this.getPatientId(userId);
    const metric = await this.prisma.healthMetric.findUnique({
      where: { id: metricId },
    });

    if (!metric) {
      throw new NotFoundException('ไม่พบข้อมูลสุขภาพที่ระบุ');
    }
    if (metric.patientId !== patientId) {
      throw new ForbiddenException('ไม่มีสิทธิ์เข้าถึงเพื่อแก้ไขข้อมูลนี้');
    }

    return this.prisma.healthMetric.update({
      where: { id: metricId },
      data: {
        weightKg: dto.weightKg,
        heightCm: dto.heightCm,
        bodyFatPercent: dto.bodyFatPercent,
      },
    });
  }

  async remove(userId: string, metricId: number) {
    const patientId = await this.getPatientId(userId);
    const metric = await this.prisma.healthMetric.findUnique({
      where: { id: metricId },
    });

    if (!metric) {
      throw new NotFoundException('ไม่พบข้อมูลสุขภาพที่ระบุ');
    }
    if (metric.patientId !== patientId) {
      throw new ForbiddenException('ไม่มีสิทธิ์เข้าถึงเพื่อลบข้อมูลนี้');
    }

    await this.prisma.healthMetric.delete({
      where: { id: metricId },
    });

    return { deletedMetricId: metricId };
  }
}
