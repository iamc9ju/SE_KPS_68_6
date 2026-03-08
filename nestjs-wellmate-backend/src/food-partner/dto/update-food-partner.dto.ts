import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateFoodPartnerDto {
  @ApiPropertyOptional({
    example: 'ร้านสลัดสุขภาพใจ (สาขาใหม่)',
    description: 'ชื่อร้านอาหารพาร์ทเนอร์',
  })
  @IsOptional()
  @IsString()
  partnerName?: string;

  @ApiPropertyOptional({
    example: 'รวมเมนูสลัดและอาหารคลีนเพื่อสุขภาพแบบพรีเมียม',
    description: 'คำอธิบายร้าน',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: '0812345678',
    description: 'เบอร์ติดต่อร้าน',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    example: '123 ถ.พระราม 9 กรุงเทพฯ',
    description: 'ที่อยู่ร้าน',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 15.0, description: 'อัตราค่าคอมมิชชัน (%)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  commissionRate?: number;

  @ApiPropertyOptional({ example: true, description: 'สถานะเปิดใช้งานร้าน' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
