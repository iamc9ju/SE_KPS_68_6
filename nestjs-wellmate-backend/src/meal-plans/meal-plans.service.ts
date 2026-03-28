import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMealPlanDto } from './dto/create-meal-plan.dto';
import { CreateMealItemDto } from './dto/create-meal-item.dto';

@Injectable()
export class MealPlansService {
  constructor(private prisma: PrismaService) {}

  async createPlan(dto: CreateMealPlanDto) {
    // @ts-ignore
    return this.prisma.mealPlan.create({
      data: {
        patientId: dto.patientId,
        nutritionistId: dto.nutritionistId,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        note: dto.note,
      },
    });
  }

  async addMealItem(mealPlanId: number, dto: CreateMealItemDto) {
    // Check if meal plan exists
    // @ts-ignore
    const plan = await this.prisma.mealPlan.findUnique({ where: { mealPlanId } });
    if (!plan) throw new NotFoundException('Meal plan not found');

    // @ts-ignore
    return this.prisma.mealPlanItem.create({
      data: {
        mealPlanId,
        planDate: new Date(dto.planDate),
        menuItemId: dto.menuItemId,
        courseId: dto.courseId,
        mealType: dto.mealType,
      },
      include: { menuItem: true },
    });
  }

  async getDailySummary(patientId: string, date: string) {
    const targetDate = new Date(date);
    
    // @ts-ignore
    const items = await this.prisma.mealPlanItem.findMany({
      where: {
        mealPlan: { patientId },
        planDate: targetDate,
      },
      include: {
        menuItem: true,
      },
    });

    const summary = items.reduce(
      (acc, item) => {
        if (item.menuItem) {
          acc.totalCalories += Number(item.menuItem.caloriesKcal || 0);
          acc.totalProtein += Number(item.menuItem.proteinG || 0);
          acc.totalCarbs += Number(item.menuItem.carbsG || 0);
          acc.totalFat += Number(item.menuItem.fatG || 0);
        }
        return acc;
      },
      { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 },
    );

    return { items, summary };
  }
}
