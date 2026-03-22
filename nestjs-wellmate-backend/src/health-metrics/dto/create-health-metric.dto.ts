import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

const GENDER_OPTIONS = ['male', 'female', 'other'] as const;
const ACTIVITY_LEVEL_OPTIONS = [
  'sedentary',
  'light',
  'moderate',
  'active',
  'very_active',
] as const;

export class CreateHealthMetricDto {
  @ApiPropertyOptional({
    description: 'Gender',
    enum: GENDER_OPTIONS,
  })
  @IsIn(GENDER_OPTIONS)
  @IsOptional()
  gender?: (typeof GENDER_OPTIONS)[number];

  @ApiPropertyOptional({
    description: 'Age in years',
    minimum: 1,
    maximum: 130,
  })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(130)
  ageYears?: number;

  @ApiPropertyOptional({
    description: 'Weight in kilograms',
    minimum: 1,
    maximum: 500,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(500)
  weightKg?: number;

  @ApiPropertyOptional({
    description: 'Height in centimeters',
    minimum: 30,
    maximum: 300,
  })
  @IsNumber()
  @IsOptional()
  @Min(30)
  @Max(300)
  heightCm?: number;

  @ApiPropertyOptional({
    description: 'Activity level for TDEE calculation',
    enum: ACTIVITY_LEVEL_OPTIONS,
  })
  @IsIn(ACTIVITY_LEVEL_OPTIONS)
  @IsOptional()
  activityLevel?: (typeof ACTIVITY_LEVEL_OPTIONS)[number];

  @ApiPropertyOptional({
    description: 'Health goal',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  goal?: string;

  @ApiPropertyOptional({
    description: 'Additional health goal detail',
    maxLength: 1000,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  goalDetail?: string;
}
