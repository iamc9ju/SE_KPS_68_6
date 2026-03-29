import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateMealPlanDto {
  @IsUUID()
  patientId: string;

  @IsUUID()
  @IsOptional()
  nutritionistId?: string; // Optional if patient records themselves

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsString()
  @IsOptional()
  note?: string;
}
