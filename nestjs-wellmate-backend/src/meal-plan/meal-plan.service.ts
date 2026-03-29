import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MealPlanService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    patientId: string;
    nutritionistId: string;
    startDate: Date;
    endDate: Date;
    note?: string;
    items: {
      planDate: Date;
      menuItemId?: number;
      courseId?: number;
      mealType: string;
    }[];
  }) {
    return this.prisma.mealPlan.create({
      data: {
        patientId: data.patientId,
        nutritionistId: data.nutritionistId,
        startDate: data.startDate,
        endDate: data.endDate,
        note: data.note,
        mealPlanItems: {
          create: data.items.map((item) => ({
            planDate: item.planDate,
            menuItemId: item.menuItemId,
            courseId: item.courseId,
            mealType: item.mealType,
          })),
        },
      },
      include: {
        mealPlanItems: {
          include: {
            menuItem: true,
            course: true,
          },
        },
      },
    });
  }

  async addPlanItem(data: {
    patientId: string;
    nutritionistId: string;
    planDate: Date;
    menuItemId?: number;
    courseId?: number;
    mealType: string;
  }) {
    // Normalize date to UTC midnight to avoid time-of-day/timezone mismatch
    const planDate = new Date(data.planDate);
    // Force to UTC midnight
    const utcDate = new Date(Date.UTC(planDate.getFullYear(), planDate.getMonth(), planDate.getDate()));

    console.log(`Adding plan item for patient ${data.patientId} on ${utcDate.toISOString()}`);

    // 1. Find or create a meal plan that covers the planDate
    let plan = await this.prisma.mealPlan.findFirst({
      where: {
        patientId: data.patientId,
        startDate: { lte: utcDate },
        endDate: { gte: utcDate },
      },
      orderBy: { startDate: 'desc' },
    });

    if (!plan) {
      console.log(`No plan found for date ${utcDate.toISOString()}, creating new weekly plan`);
      // Create a default 1-week plan starting from the Monday of that week
      const day = utcDate.getUTCDay();
      const diff = utcDate.getUTCDate() - day + (day === 0 ? -6 : 1);
      
      const monday = new Date(Date.UTC(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), diff));
      const sunday = new Date(monday);
      sunday.setUTCDate(monday.getUTCDate() + 6);
      sunday.setUTCHours(23, 59, 59, 999);

      plan = await this.prisma.mealPlan.create({
        data: {
          patientId: data.patientId,
          nutritionistId: data.nutritionistId,
          startDate: monday,
          endDate: sunday,
        },
      });
      console.log(`Created plan ${plan.mealPlanId} from ${monday.toISOString()} to ${sunday.toISOString()}`);
    } else {
      console.log(`Found existing plan ${plan.mealPlanId}`);
    }

    // 2. Clear existing item for same date/type (to avoid duplicates)
    await this.prisma.mealPlanItem.deleteMany({
      where: {
        mealPlanId: plan.mealPlanId,
        planDate: utcDate,
        mealType: data.mealType,
      },
    });

    // 3. Create new item
    return this.prisma.mealPlanItem.create({
      data: {
        mealPlanId: plan.mealPlanId,
        planDate: utcDate,
        menuItemId: data.menuItemId,
        courseId: data.courseId,
        mealType: data.mealType,
      },
      include: {
        menuItem: true,
      },
    });
  }

  async findByPatient(patientId: string) {
    return this.prisma.mealPlan.findMany({
      where: { patientId },
      orderBy: { startDate: 'desc' },
      include: {
        mealPlanItems: {
          include: {
            menuItem: {
              include: {
                foodPartner: true,
              },
            },
            course: true,
          },
          orderBy: { planDate: 'asc' },
        },
        nutritionist: true,
      },
    });
  }

  async updateItem(itemId: number, data: { isDone?: boolean; note?: string }) {
    const item = await this.prisma.mealPlanItem.findUnique({
      where: { mealPlanItemId: itemId },
    });

    if (!item) {
      throw new NotFoundException(`Meal plan item with ID ${itemId} not found`);
    }

    return this.prisma.mealPlanItem.update({
      where: { mealPlanItemId: itemId },
      data: {
        isDone: data.isDone,
        loggedAt: data.isDone ? new Date() : null,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.mealPlan.delete({
      where: { mealPlanId: id },
    });
  }
}
