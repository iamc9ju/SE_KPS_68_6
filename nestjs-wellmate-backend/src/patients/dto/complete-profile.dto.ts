import {
  IsOptional,
  IsString,
  IsArray,
  IsEnum,
  IsISO8601,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GenderType } from '@prisma/client';

export class CompleteProfileDto {
  @ApiProperty({
    description: 'Date of birth',
    example: '1990-01-01',
    required: false,
  })
  @IsOptional()
  @IsISO8601()
  dateOfBirth?: string;

  @ApiProperty({
    enum: GenderType,
    description: 'Gender',
    example: GenderType.male,
    required: false,
  })
  @IsOptional()
  @IsEnum(GenderType)
  gender?: GenderType;

  @ApiProperty({ description: 'Blood type', example: 'A+', required: false })
  @IsOptional()
  @IsString()
  bloodType?: string;

  @ApiProperty({
    description: 'Chronic diseases',
    example: ['Diabetes'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  chronicDiseases?: string[];
}
