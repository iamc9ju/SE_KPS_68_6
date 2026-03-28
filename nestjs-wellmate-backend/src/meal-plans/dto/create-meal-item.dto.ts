import { IsDateString, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export enum MealType {
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch',
  DINNER = 'dinner',
  SNACK = 'snack',
}

export class CreateMealItemDto {
  @IsDateString()
  planDate: string;

  @IsInt()
  menuItemId: number;

  @IsOptional()
  @IsInt()
  courseId?: number;

  @IsEnum(MealType)
  mealType: string;
}
