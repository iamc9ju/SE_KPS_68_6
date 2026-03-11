import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class CreateHealthMetricDto {
  @ApiPropertyOptional({
    description: 'Weight in kilograms',
    minimum: 1,
    maximum: 500,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(500)
  weightKg?: number;

  @ApiPropertyOptional({
    description: 'Height in centimeters',
    minimum: 30,
    maximum: 300,
  })
  @IsNumber()
  @IsOptional()
  @Min(30)
  @Max(300)
  heightCm?: number;
}
