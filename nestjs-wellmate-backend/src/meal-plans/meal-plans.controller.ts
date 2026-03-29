import { Controller, Post, Body, Get, Param, Query, UseGuards, Request } from '@nestjs/common';
import { MealPlansService } from './meal-plans.service';
import { CreateMealPlanDto } from './dto/create-meal-plan.dto';
import { CreateMealItemDto } from './dto/create-meal-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';

@Controller('meal-plans')
@UseGuards(JwtAuthGuard)
export class MealPlansController {
  constructor(private readonly mealPlansService: MealPlansService) {}

  @Post()
  create(@Body() createMealPlanDto: CreateMealPlanDto) {
    return this.mealPlansService.createPlan(createMealPlanDto);
  }

  @Post(':id/items')
  addItem(@Param('id') id: string, @Body() createMealItemDto: CreateMealItemDto) {
    return this.mealPlansService.addMealItem(+id, createMealItemDto);
  }

  @Get('summary')
  getSummary(@Request() req, @Query('date') date: string) {
    return this.mealPlansService.getDailySummary(req.user.userId, date);
  }
}
