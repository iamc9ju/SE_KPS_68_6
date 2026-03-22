import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCalendarDto } from './dto/create-calendar.dto';

interface CreateActivityDto {
  title: string;
  description?: string;
  startTime: string;
  endTime?: string;
  calories?: number;
}

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

  // helper หา patient จาก user
  private async getPatient(userId: string) {

  const patient = await this.prisma.patient.findUnique({
    where: { userId }
  });

  if (!patient) {
    throw new Error("Patient not found");
  }

  return patient;
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

  // Create
  async create(dto: CreateCalendarDto, userId: string) {

  const patient = await this.getPatient(userId);

  return this.prisma.physicalActivity.create({
    data: {
      title: dto.title,
      description: dto.description,
      startTime: dto.startTime,
      endTime: dto.endTime,
      calories: dto.calories,
      patientId: patient.patientId
    }
  });

}

  // Get events
  async getEvents(userId: string, start?: string, end?: string) {
    const patient = await this.getPatient(userId);
    console.log("PATIENT:", patient);

    let dateFilter = {};

    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new BadRequestException('Invalid date format');
      }

      dateFilter = {
        startTime: {
          gte: startDate,
          lte: endDate,
        },
      };
    }

    const activities = await this.prisma.physicalActivity.findMany({
      where: {
        patientId: patient.patientId,
        deletedAt: null,
        ...dateFilter,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return {
  data: activities.map((item) => ({
    id: item.activityId,
    title: item.title,
    startTime: item.startTime,
    endTime: item.endTime,
    type: 'physical',
  })),
};
  }

  // Get detail
  async getDetail(userId: string, activityId: string) {
    const patient = await this.getPatient(userId);

    return this.findActivity(activityId, patient.patientId);
  }

  // Update
  async update(userId: string, activityId: string, data: UpdateActivityDto) {
    const patient = await this.getPatient(userId);

    await this.findActivity(activityId, patient.patientId);

    const updateData: any = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.calories !== undefined) updateData.calories = data.calories;

    if (data.startTime) {
      const start = new Date(data.startTime);
      if (isNaN(start.getTime())) {
        throw new BadRequestException('Invalid startTime format');
      }
      updateData.startTime = start;
    }

    if (data.endTime) {
      const end = new Date(data.endTime);
      if (isNaN(end.getTime())) {
        throw new BadRequestException('Invalid endTime format');
      }
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

    await this.findActivity(activityId, patient.patientId);

    return this.prisma.physicalActivity.update({
      where: {
        activityId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}