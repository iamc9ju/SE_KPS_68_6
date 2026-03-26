import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateFoodPartnerProfileDto {
  @ApiPropertyOptional({ example: 'Green Bowl Kitchen' })
  @IsOptional()
  @IsString()
  partnerName?: string;

  @ApiPropertyOptional({ example: 'Healthy clean food with organic ingredients.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '88/21' })
  @IsOptional()
  @IsString()
  addressLine1?: string;

  @ApiPropertyOptional({ example: 'Soi Sukkapab 5' })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiPropertyOptional({ example: 'Huai Khwang' })
  @IsOptional()
  @IsString()
  subdistrict?: string;

  @ApiPropertyOptional({ example: 'Huai Khwang' })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({ example: 'Bangkok' })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional({ example: '10310' })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional({ example: 13.7621 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: 100.5664 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({ example: '098-889-3344' })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional({ example: 'hello@greenbowl.co' })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiPropertyOptional({ example: '@greenbowl' })
  @IsOptional()
  @IsString()
  lineId?: string;

  @ApiPropertyOptional({ example: 'https://facebook.com/greenbowl' })
  @IsOptional()
  @IsString()
  socialLink?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/logo.png' })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/cover.png' })
  @IsOptional()
  @IsString()
  coverImageUrl?: string;

  @ApiPropertyOptional({ example: ['คลีน', 'คีโต'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  storeOnline?: boolean;

  @ApiPropertyOptional({ example: '2026-03-22T12:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  pauseUntil?: string;

  @ApiPropertyOptional({
    example: [{ date: '2026-04-13', reason: 'Songkran' }],
  })
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  holidayClosures?: Record<string, unknown>[];

  @ApiPropertyOptional({ example: 'Kasikornbank' })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiPropertyOptional({ example: 'xxx-x-xx123-4' })
  @IsOptional()
  @IsString()
  bankAccountNo?: string;

  @ApiPropertyOptional({ example: 'Green Bowl Co., Ltd.' })
  @IsOptional()
  @IsString()
  bankAccountName?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/bank-doc.png' })
  @IsOptional()
  @IsString()
  bankDocumentUrl?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/business-doc.png' })
  @IsOptional()
  @IsString()
  businessDocumentUrl?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
