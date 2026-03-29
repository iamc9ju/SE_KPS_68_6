import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { MealPlanService } from './meal-plan.service';

@Controller('meal-plan')
export class MealPlanController {
  constructor(private readonly mealPlanService: MealPlanService) {}

  @Post()
  create(@Body() createMealPlanDto: {
    patientId: string;
    nutritionistId: string;
    startDate: string;
    endDate: string;
    appointmentId?: string;
    note?: string;
    items: {
      planDate: string;
      menuItemId?: number;
      courseId?: number;
      mealType: string;
    }[];
  }) {
    return this.mealPlanService.create({
      ...createMealPlanDto,
      startDate: new Date(createMealPlanDto.startDate),
      endDate: new Date(createMealPlanDto.endDate),
      items: createMealPlanDto.items.map(item => ({
        ...item,
        planDate: new Date(item.planDate),
      })),
    });
  }

  @Post('item')
  addItem(@Body() addItemDto: {
    patientId: string;
    nutritionistId: string;
    planDate: string;
    menuItemId?: number;
    courseId?: number;
    appointmentId?: string;
    mealType: string;
  }) {
    return this.mealPlanService.addPlanItem({
      ...addItemDto,
      planDate: new Date(addItemDto.planDate),
    });
  }

  @Get('patient/:id')
  findByPatient(@Param('id') id: string) {
    return this.mealPlanService.findByPatient(id);
  }

  @Patch('item/:id')
  updateItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateItemDto: { isDone?: boolean; note?: string }
  ) {
    return this.mealPlanService.updateItem(id, updateItemDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.mealPlanService.remove(id);
  }
}
