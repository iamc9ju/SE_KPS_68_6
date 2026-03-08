import { IsString, IsUUID, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNutritionistDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'User ID ของนักโภชนาการ',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({ example: 'สมชาย', description: 'ชื่อจริง' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'ใจดี', description: 'นามสกุล' })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({
    example: 'NUT12345',
    description: 'เลขใบอนุญาตประกอบวิชาชีพ',
  })
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/license.pdf',
    description: 'URL ไฟล์ใบอนุญาต',
  })
  @IsOptional()
  @IsString()
  licenseDocumentUrl?: string;

  @ApiPropertyOptional({ example: 500, description: 'ค่าปรึกษาต่อครั้ง (บาท)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  consultationFee?: number;
}
