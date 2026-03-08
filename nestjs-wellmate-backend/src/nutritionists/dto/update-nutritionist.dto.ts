import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateNutritionistDto {
  @ApiPropertyOptional({ example: 'สมชาย', description: 'ชื่อจริง' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'ใจดีมาก', description: 'นามสกุล' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: 600, description: 'ค่าปรึกษาต่อครั้ง (บาท)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  consultationFee?: number;
}
