import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  FindNutritionistsQueryDto,
  SortBy,
} from './dto/find-nutritionists-query.dto';
import { Prisma, VerificationStatus } from '@prisma/client';
import { addMinutes, format, getDay, isAfter, parseISO } from 'date-fns';

@Injectable()
export class NutritionistsService {
  constructor(private prisma: PrismaService) { }

  async findAll(query: FindNutritionistsQueryDto) {
    const {
      search,
      specialty,
      sortBy,
      page = 1,
      limit = 12,
      maxFee,
      minRating,
    } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.NutritionistWhereInput = {
      verificationStatus: VerificationStatus.approved,
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { first_name: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (specialty) {
      where.nutritionistSpecialties = {
        some: { specialty: { name: specialty } },
      };
    }

    if (maxFee !== undefined) {
      where.consultationFee = { lte: maxFee };
    }

    let orderBy: Prisma.NutritionistOrderByWithRelationInput;
    switch (sortBy) {
      case SortBy.LOWEST_FEE:
        orderBy = { consultationFee: 'asc' };
        break;
      case SortBy.HIGHEST_RATED:
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const allNutritionists = await this.prisma.nutritionist.findMany({
      where,
      orderBy,
      include: {
        user: {
          select: {
            email: true,
            profileImageUrl: true,
          },
        },
        nutritionistSpecialties: {
          select: {
            specialty: { select: { id: true, name: true } },
          },
        },
        reviews: {
          select: { rating: true },
        },
      },
    });

    const formattedNutritionists = allNutritionists
      .map((nutri) => {
        const reviews = (nutri as any).reviews || [];
        const totalReviews = reviews.length;
        const avgRating =
          totalReviews > 0
            ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / totalReviews
            : 0;

        const { reviews: _unused, ...rest } = nutri;

        return {
          ...rest,
          consultationFee: Number(nutri.consultationFee),
          avgRating: parseFloat(avgRating.toFixed(1)),
          totalReviews,
        };
      })
      .filter((nutri) => {
        if (minRating !== undefined) {
          return nutri.avgRating >= minRating;
        }
        return true;
      });

    const total = formattedNutritionists.length;
    const paginatedData = formattedNutritionists.slice(skip, skip + limit);

    return {
      data: paginatedData,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(nutritionistId: string) {
    const nutritionist = await this.prisma.nutritionist.findUnique({
      where: { nutritionistId },
      include: {
        user: {
          select: {
            email: true,
            profileImageUrl: true,
          },
        },
        nutritionistSpecialties: {
          select: { specialty: { select: { id: true, name: true } } },
        },
        nutritionistSchedules: {
          where: { isAvailable: true },
          orderBy: { dayOfWeek: 'asc' },
        },
        reviews: {
          select: {
            rating: true,
            comment: true,
            createdAt: true,
            patient: {
              select: {
                first_name: true, // ตรวจสอบว่าใน Schema เปลี่ยนจาก first_name เป็น name หรือยัง
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!nutritionist) {
      throw new NotFoundException('ไม่พบนักโภชนาการ');
    }

    const reviews = (nutritionist as any).reviews || [];
    const totalReviews = reviews.length;
    const avgRating =
      totalReviews > 0
        ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / totalReviews
        : 0;

    return {
      ...nutritionist,
      consultationFee: Number(nutritionist.consultationFee),
      avgRating: parseFloat(avgRating.toFixed(1)),
      totalReviews,
    };
  }

  async create(dto: Prisma.NutritionistUncheckedCreateInput) {
    return this.prisma.nutritionist.create({
      data: dto,
    });
  }

  async update(id: string, dto: Prisma.NutritionistUpdateInput) {
    await this.findOne(id);
    return this.prisma.nutritionist.update({
      where: { nutritionistId: id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.nutritionist.update({
      where: { nutritionistId: id },
      data: { deletedAt: new Date() },
    });
  }

  async getAvailability(nutritionistId: string, dateString: string) {
    const nutritionist = await this.prisma.nutritionist.findUnique({
      where: {
        nutritionistId,
        verificationStatus: 'approved',
      },
    });

    if (!nutritionist) {
      throw new NotFoundException('ไม่พบนักโภชนาการ หรือยังไม่ได้รับการอนุมัติ');
    }

    const requestDate = parseISO(dateString);
    const requestDayOfWeek = getDay(requestDate);

    const startOfDay = new Date(`${dateString}T00:00:00.000Z`);
    const endOfDay = new Date(`${dateString}T23:59:59.999Z`);

    const schedule = await this.prisma.nutritionistSchedule.findFirst({
      where: {
        nutritionistId,
        dayOfWeek: requestDayOfWeek,
        isAvailable: true,
      },
    });

    if (!schedule) return [];

    const [startHour, startMin] = schedule.startTime.split(':').map(Number);
    const [endHour, endMin] = schedule.endTime.split(':').map(Number);

    const actualStartDateTime = new Date(requestDate);
    actualStartDateTime.setHours(startHour, startMin, 0, 0);

    const actualEndDateTime = new Date(requestDate);
    actualEndDateTime.setHours(endHour, endMin, 0, 0);

    // แก้ไขจุดที่เคยแดง: ระบุ Type ให้ชัดเจนและจัดการ Loop ให้ถูกต้อง
    const allSlots: { time: string; startDateTime: Date; endDateTime: Date }[] = [];
    let currentSlot = actualStartDateTime;

    while (isAfter(actualEndDateTime, currentSlot)) {
      const nextSlot = addMinutes(currentSlot, 60);

      if (isAfter(nextSlot, actualEndDateTime)) break;

      allSlots.push({
        time: format(currentSlot, 'HH:mm'),
        startDateTime: new Date(currentSlot),
        endDateTime: nextSlot,
      });

      currentSlot = nextSlot;
    }

    const existingAppointments = await this.prisma.appointment.findMany({
      where: {
        nutritionistId,
        startTime: { gte: startOfDay, lte: endOfDay },
        status: { in: ['pending', 'confirmed'] },
      },
      select: { startTime: true },
    });

    const bookedTimes = new Set(
      existingAppointments.map((appt) => appt.startTime.getTime()),
    );

    return allSlots.map((slot) => ({
      time: slot.time,
      available: !bookedTimes.has(slot.startDateTime.getTime()),
    }));
  }
}