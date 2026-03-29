import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateProgressEntryDto } from './dto/create-progress-entry.dto';
import { UploadProgressPhotoDto } from './dto/upload-progress-photo.dto';

@Injectable()
export class ProgressService {
  private readonly logger = new Logger(ProgressService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private async getPatientByUserId(userId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
      select: {
        patientId: true,
        goal: true,
        goalDetail: true,
        targetWeightKg: true,
        activityLevel: true,
        user: {
          select: {
            userId: true,
            email: true,
          },
        },
      },
    });

    if (!patient) {
      throw new NotFoundException(
        'ไม่พบโปรไฟล์ผู้ป่วย กรุณาสร้างข้อมูลสุขภาพก่อน',
      );
    }

    return patient;
  }

  async getOverview(userId: string) {
    const patient = await this.getPatientByUserId(userId);

    const [latestHealthMetric, latestMeasurement, recentPhotos] =
      await Promise.all([
        this.prisma.healthMetric.findFirst({
          where: { patientId: patient.patientId },
          orderBy: { recordedAt: 'desc' },
        }),
        this.prisma.bodyMeasurementLog.findFirst({
          where: { patientId: patient.patientId },
          orderBy: { recordedAt: 'desc' },
        }),
        this.prisma.progressPhoto.findMany({
          where: { patientId: patient.patientId },
          orderBy: { createdAt: 'desc' },
          take: 6,
        }),
      ]);

    return {
      patient,
      latestHealthMetric,
      latestMeasurement,
      recentPhotos,
    };
  }

  async getHistory(userId: string) {
    const patient = await this.getPatientByUserId(userId);

    const [healthMetrics, measurementLogs] = await Promise.all([
      this.prisma.healthMetric.findMany({
        where: { patientId: patient.patientId },
        orderBy: { recordedAt: 'asc' },
      }),
      this.prisma.bodyMeasurementLog.findMany({
        where: { patientId: patient.patientId },
        orderBy: { recordedAt: 'asc' },
      }),
    ]);

    return {
      healthMetrics,
      measurementLogs,
    };
  }

  async createEntry(userId: string, dto: CreateProgressEntryDto) {
    const patient = await this.getPatientByUserId(userId);

    const result = await this.prisma.$transaction(async (tx) => {
      const measurement = await tx.bodyMeasurementLog.create({
        data: {
          patientId: patient.patientId,
          weightKg: dto.weightKg,
          bodyFatPercent: dto.bodyFatPercent,
          chestCm: dto.chestCm,
          armCm: dto.armCm,
          waistCm: dto.waistCm,
          hipsCm: dto.hipsCm,
          thighCm: dto.thighCm,
          caloriesKcal: dto.caloriesKcal,
          waterMl: dto.waterMl,
          stepsCount: dto.stepsCount,
          sleepHours: dto.sleepHours,
          note: dto.note,
          recordedAt: dto.recordedAt,
        },
      });

      if (dto.activityLevel || dto.targetWeightKg !== undefined) {
        await tx.patient.update({
          where: { patientId: patient.patientId },
          data: {
            ...(dto.activityLevel ? { activityLevel: dto.activityLevel } : {}),
            ...(dto.targetWeightKg !== undefined
              ? { targetWeightKg: dto.targetWeightKg }
              : {}),
          },
        });
      }

      let healthMetric: Awaited<
        ReturnType<typeof tx.healthMetric.create>
      > | null = null;
      if (dto.weightKg !== undefined || dto.heightCm !== undefined) {
        healthMetric = await tx.healthMetric.create({
          data: {
            patientId: patient.patientId,
            weightKg: dto.weightKg,
            heightCm: dto.heightCm,
            activityLevel: dto.activityLevel,
          },
        });
      }

      return { measurement, healthMetric };
    });

    this.logger.log(`Created progress entry for patient ${patient.patientId}`);
    return result;
  }

  async getPhotos(userId: string) {
    const patient = await this.getPatientByUserId(userId);

    return this.prisma.progressPhoto.findMany({
      where: { patientId: patient.patientId },
      include: {
        bodyMeasurementLog: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async uploadPhoto(
    userId: string,
    dto: UploadProgressPhotoDto,
    file: Express.Multer.File,
  ) {
    const patient = await this.getPatientByUserId(userId);

    if (dto.bodyMeasurementLogId) {
      const measurement = await this.prisma.bodyMeasurementLog.findUnique({
        where: { bodyMeasurementLogId: dto.bodyMeasurementLogId },
        select: { patientId: true },
      });

      if (!measurement) {
        throw new NotFoundException('ไม่พบรายการ progress ที่ต้องการผูกรูป');
      }

      if (measurement.patientId !== patient.patientId) {
        throw new ForbiddenException('ไม่สามารถแนบรูปกับ progress ของผู้อื่นได้');
      }
    }

    const uploadResult = await this.cloudinaryService.uploadImage(file);
    const imageUrl = (uploadResult as { secure_url: string }).secure_url;

    const photo = await this.prisma.progressPhoto.create({
      data: {
        patientId: patient.patientId,
        bodyMeasurementLogId: dto.bodyMeasurementLogId,
        imageUrl,
        caption: dto.caption,
        takenAt: dto.takenAt,
      },
    });

    this.logger.log(`Uploaded progress photo for patient ${patient.patientId}`);
    return photo;
  }
}
