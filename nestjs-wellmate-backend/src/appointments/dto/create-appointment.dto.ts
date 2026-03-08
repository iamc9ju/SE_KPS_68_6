import {
  IsNotEmpty,
  IsISO8601,
  IsString,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AppointmentType } from '@prisma/client';

export class CreateAppointmentDto {
  @ApiProperty({ description: 'Nutritionist ID (UUID)' })
  @IsUUID()
  @IsNotEmpty()
  nutritionistId: string;

  @ApiProperty({ example: '2024-03-20T10:00:00.000Z' })
  @IsISO8601()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ enum: AppointmentType, default: AppointmentType.online })
  @IsEnum(AppointmentType)
  @IsNotEmpty()
  type: AppointmentType;
}
