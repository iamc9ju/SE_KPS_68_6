import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UserRole } from '@prisma/client';

interface UpdateActivityDto {
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  calories?: number;
}

@Injectable()
export class CalendarService {
  constructor(private prisma: PrismaService) {}

  private async getPatient(userId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
    });
    return patient;
  }

  private async getNutritionist(userId: string) {
    const nutritionist = await this.prisma.nutritionist.findUnique({
      where: { userId },
    });
    return nutritionist;
  }

  // helper หา activity
  private async findActivity(activityId: string, patientId: string) {
    const activity = await this.prisma.physicalActivity.findFirst({
      where: {
        activityId,
        patientId,
        deletedAt: null,
      },
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    return activity;
  }

  // Create (Only for Patients)
  async create(dto: CreateCalendarDto, userId: string) {
    const patient = await this.getPatient(userId);
    if (!patient) {
      throw new BadRequestException(
        'Only patients can create physical activities',
      );
    }

    return this.prisma.physicalActivity.create({
      data: {
        title: dto.title,
        description: dto.description,
        startTime: dto.startTime,
        endTime: dto.endTime,
        calories: dto.calories,
        patientId: patient.patientId,
      },
    });
  }

  // Get events
  async getEvents(userId: string, start?: string, end?: string) {
    const user = await this.prisma.user.findUnique({
      where: { userId },
      select: { role: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const startDate = start ? new Date(start) : undefined;
    const endDate = end ? new Date(end) : undefined;

    if (
      startDate &&
      endDate &&
      (isNaN(startDate.getTime()) || isNaN(endDate.getTime()))
    ) {
      throw new BadRequestException('Invalid date format');
    }

    const events: any[] = [];

    // Pre-fetch profiles to avoid redundant calls
    let patient: any = null;
    let nutritionist: any = null;

    if (user.role === UserRole.patient) {
      patient = await this.getPatient(userId);
    } else if (user.role === UserRole.nutritionist) {
      nutritionist = await this.getNutritionist(userId);
    }

    const promises: Promise<any>[] = [];

    // 1. Fetch Physical Activities (Only for Patients)
    if (user.role === UserRole.patient && patient) {
      const activitiesPromise = this.prisma.physicalActivity
        .findMany({
          where: {
            patientId: patient.patientId,
            deletedAt: null,
            ...(startDate && endDate
              ? {
                  startTime: { gte: startDate, lte: endDate },
                }
              : {}),
          },
          select: {
            activityId: true,
            title: true,
            startTime: true,
            endTime: true,
          },
          orderBy: { startTime: 'asc' },
        })
        .then((activities) =>
          activities.map((a) => ({
            id: a.activityId,
            title: a.title,
            startTime: a.startTime,
            endTime: a.endTime,
            type: 'physical',
          })),
        );

      promises.push(activitiesPromise);
    }

    // 2. Fetch Appointments
    let appointmentWhere: any = { deletedAt: null };
    if (user.role === UserRole.patient && patient) {
      appointmentWhere.patientId = patient.patientId;
    } else if (user.role === UserRole.nutritionist && nutritionist) {
      appointmentWhere.nutritionistId = nutritionist.nutritionistId;
    }

    // Only fetch if we have a profile-based filter (or if admin, maybe don't filter)
    if (
      appointmentWhere.patientId ||
      appointmentWhere.nutritionistId ||
      user.role === UserRole.admin
    ) {
      if (startDate && endDate) {
        appointmentWhere.startTime = { gte: startDate, lte: endDate };
      }

      const appointmentsPromise = this.prisma.appointment
        .findMany({
          where: appointmentWhere,
          select: {
            appointmentId: true,
            startTime: true,
            endTime: true,
            nutritionist:
              user.role === UserRole.patient
                ? { select: { firstName: true, lastName: true } }
                : false,
            patient:
              user.role === UserRole.nutritionist
                ? { select: { firstName: true, lastName: true } }
                : false,
          },
        })
        .then((appointments) =>
          appointments.map((a: any) => {
            let title = 'Appointment';
            if (user.role === UserRole.patient && a.nutritionist) {
              title = `Consultation with ${a.nutritionist.firstName}`;
            } else if (user.role === UserRole.nutritionist && a.patient) {
              title = `Patient: ${a.patient.firstName} ${a.patient.lastName}`;
            }

            return {
              id: a.appointmentId,
              title: title,
              startTime: a.startTime,
              endTime: a.endTime,
              type: 'appointment',
            };
          }),
        );

      promises.push(appointmentsPromise);
    }

    // Execute concurrently
    const results = await Promise.all(promises);
    results.forEach((result) => events.push(...result));

    return { data: events };
  }

  // Get detail
  async getDetail(userId: string, activityId: string) {
    const patient = await this.getPatient(userId);
    if (!patient) throw new NotFoundException('Activity not found');
    return this.findActivity(activityId, patient.patientId);
  }

  // Update
  async update(userId: string, activityId: string, data: UpdateActivityDto) {
    const patient = await this.getPatient(userId);
    if (!patient)
      throw new ForbiddenException(
        'Only patients can update physical activities',
      );

    await this.findActivity(activityId, patient.patientId);

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.calories !== undefined) updateData.calories = data.calories;

    if (data.startTime) {
      const start = new Date(data.startTime);
      if (isNaN(start.getTime()))
        throw new BadRequestException('Invalid startTime format');
      updateData.startTime = start;
    }

    if (data.endTime) {
      const end = new Date(data.endTime);
      if (isNaN(end.getTime()))
        throw new BadRequestException('Invalid endTime format');
      updateData.endTime = end;
    }

    return this.prisma.physicalActivity.update({
      where: { activityId },
      data: updateData,
    });
  }

  // Soft delete
  async remove(userId: string, activityId: string) {
    const patient = await this.getPatient(userId);
    if (!patient)
      throw new ForbiddenException(
        'Only patients can remove physical activities',
      );

    await this.findActivity(activityId, patient.patientId);

    return this.prisma.physicalActivity.update({
      where: { activityId },
      data: { deletedAt: new Date() },
    });
  }
}
