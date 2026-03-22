import {
  IsString,
  IsOptional,
  IsInt,
  IsUUID,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class CreateCalendarDto {

  @IsString()
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  // รับเป็น ISO string จาก frontend (เช่น 2026-03-05T10:00:00)
  @IsDateString()
  startTime: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;

  @IsOptional()
  @IsInt()
  calories?: number;
}