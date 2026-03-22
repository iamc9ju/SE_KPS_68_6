import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFoodPartnerDto {
  @ApiProperty({
    example: 'ร้านสลัดสุขภาพใจ',
    description: 'ชื่อร้านอาหารพาร์ทเนอร์',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'รวมเมนูสลัดและอาหารคลีนเพื่อสุขภาพ',
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
    example: '123 ถ.สุขุมวิท กรุงเทพฯ',
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
}
