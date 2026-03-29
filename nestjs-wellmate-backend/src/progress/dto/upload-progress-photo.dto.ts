import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UploadProgressPhotoDto {
  @ApiPropertyOptional({ example: 'Front pose - week 2' })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiPropertyOptional({ example: '2026-03-29T08:00:00.000Z' })
  @IsOptional()
  @Type(() => Date)
  takenAt?: Date;

  @ApiPropertyOptional({
    example: '5d56c18d-05a0-4690-a2bd-1f564403f0b4',
  })
  @IsOptional()
  @IsUUID()
  bodyMeasurementLogId?: string;
}
