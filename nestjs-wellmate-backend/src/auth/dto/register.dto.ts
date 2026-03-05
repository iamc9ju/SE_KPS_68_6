import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
  ValidateIf,
  IsNotEmpty,
} from 'class-validator';
import { UserRole } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '12345678', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    enum: ['patient', 'nutritionist', 'food_partner'],
    example: 'patient',
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiPropertyOptional({ example: 'John' })
  @ValidateIf((o) => o.role !== 'food_partner')
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @ValidateIf((o) => o.role !== 'food_partner')
  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @ApiPropertyOptional({ example: 'ร้านอาหารสุขภาพ ABC' })
  @ValidateIf((o) => o.role === 'food_partner')
  @IsString()
  @IsNotEmpty()
  partnerName?: string;

  @ApiPropertyOptional({ example: '0812345678' })
  @IsString()
  @IsOptional()
  phone?: string;
}
