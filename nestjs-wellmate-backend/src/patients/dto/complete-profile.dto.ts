import {
  IsOptional,
  IsString,
  IsArray,
  IsEnum,
  IsISO8601,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GenderType, ActivityLevel } from '@prisma/client';

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

  @ApiProperty({
    description: 'Health goal',
    example: 'ลดน้ำหนัก',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  goal?: string;

  @ApiProperty({
    description: 'Additional health goal detail',
    example: 'ต้องการลดน้ำหนัก 5 กิโลกรัมภายใน 3 เดือน',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  goalDetail?: string;

  @ApiProperty({
    enum: ActivityLevel,
    description: 'Activity level',
    required: false,
  })
  @IsOptional()
  @IsEnum(ActivityLevel)
  activityLevel?: ActivityLevel;
}
