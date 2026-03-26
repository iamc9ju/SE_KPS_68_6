import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OpeningSlotDto {
  @ApiProperty({ example: '08:00' })
  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  startTime: string;

  @ApiProperty({ example: '14:00' })
  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  endTime: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  sequence?: number;
}

export class OpeningHourDto {
  @ApiProperty({ example: 1, description: '0=Sun ... 6=Sat' })
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  isOpen: boolean;

  @ApiProperty({ type: [OpeningSlotDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OpeningSlotDto)
  slots: OpeningSlotDto[];
}

export class UpdateOpeningHoursDto {
  @ApiProperty({ type: [OpeningHourDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OpeningHourDto)
  days: OpeningHourDto[];
}
