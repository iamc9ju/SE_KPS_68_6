import { IsArray, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAppointmentRecommendationsDto {
  @ApiProperty({ type: [Number], description: 'รายการไอดีเมนูอาหารที่แนะนำ' })
  @IsArray()
  @IsInt({ each: true })
  menuItemIds: number[];
}
