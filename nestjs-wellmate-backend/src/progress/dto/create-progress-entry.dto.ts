import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ActivityLevel } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateProgressEntryDto {
  @ApiPropertyOptional({ example: 71.5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  weightKg?: number;

  @ApiPropertyOptional({ example: 170 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  heightCm?: number;

  @ApiPropertyOptional({ example: 60.5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  targetWeightKg?: number;

  @ApiPropertyOptional({ example: 18.5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  bodyFatPercent?: number;

  @ApiPropertyOptional({ example: 95 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  chestCm?: number;

  @ApiPropertyOptional({ example: 31 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  armCm?: number;

  @ApiPropertyOptional({ example: 80 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  waistCm?: number;

  @ApiPropertyOptional({ example: 98 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  hipsCm?: number;

  @ApiPropertyOptional({ example: 60 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  thighCm?: number;

  @ApiPropertyOptional({ example: 1850 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  caloriesKcal?: number;

  @ApiPropertyOptional({ example: 2200 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  waterMl?: number;

  @ApiPropertyOptional({ example: 8500 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stepsCount?: number;

  @ApiPropertyOptional({ example: 7.5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(24)
  sleepHours?: number;

  @ApiPropertyOptional({ enum: ActivityLevel, example: ActivityLevel.moderate })
  @IsOptional()
  @IsEnum(ActivityLevel)
  activityLevel?: ActivityLevel;

  @ApiPropertyOptional({ example: 'ลดหวานช่วงเย็นและเดินเพิ่ม' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({ example: '2026-03-29T08:00:00.000Z' })
  @IsOptional()
  @Type(() => Date)
  recordedAt?: Date;
}
