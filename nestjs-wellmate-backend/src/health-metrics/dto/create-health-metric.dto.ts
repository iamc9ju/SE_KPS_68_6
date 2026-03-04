import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateHealthMetricDto {
  @ApiPropertyOptional({
    description: 'น้ำหนัก (กิโลกรัม)',
    minimum: 1,
    maximum: 500,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(500)
  weightKg?: number;

  @ApiPropertyOptional({
    description: 'ส่วนสูง (เซนติเมตร)',
    minimum: 30,
    maximum: 300,
  })
  @IsNumber()
  @IsOptional()
  @Min(30)
  @Max(300)
  heightCm?: number;

  @ApiPropertyOptional({
    description: 'เปอร์เซ็นต์ไขมันในร่างกาย (%)',
    minimum: 1,
    maximum: 100,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  bodyFatPercent?: number;
}
