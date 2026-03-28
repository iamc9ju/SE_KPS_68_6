import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CompleteProfileDto } from './dto/complete-profile.dto';

@Injectable()
export class PatientsService {
  private readonly logger = new Logger(PatientsService.name);

  constructor(private prisma: PrismaService) { }

  async completeProfile(userId: string, dto: CompleteProfileDto) {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const updated = await this.prisma.patient.update({
      where: { patientId: patient.patientId },
      data: {
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        gender: dto.gender,
        bloodType: dto.bloodType,
        chronicDiseases: dto.chronicDiseases,



        isProfileComplete: true,
      },
    });

    this.logger.log(`Patient ${patient.patientId} completed profile`);
    return updated;
  }

  async getProfile(userId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
      include: {
        user: true,
        healthMetrics: {
          orderBy: { recordedAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return {
      userId: patient.userId,
      patientId: patient.patientId,
      email: patient.user.email,
      role: patient.user.role,
      // ✅ แก้ไข: ใช้ name เพียงอย่างเดียว และใส่ as any เพื่อหลีกเลี่ยง Type Error ชั่วคราว
      name: (patient as any).name || 'Unknown',
      phoneNumber: patient.user.phone,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      bloodType: patient.bloodType,
      chronicDiseases: patient.chronicDiseases,
      // ... โค้ดด้านบน ...
      goal: patient.healthMetrics?.[0]?.goal || null,
      goalDetail: patient.healthMetrics?.[0]?.goalDetail || null,
      activityLevel: patient.healthMetrics?.[0]?.activityLevel || null,
      isProfileComplete: patient.isProfileComplete,
      healthMetrics: patient.healthMetrics?.[0] || null,
      // ... โค้ดด้านล่าง ...
    };
  }
}