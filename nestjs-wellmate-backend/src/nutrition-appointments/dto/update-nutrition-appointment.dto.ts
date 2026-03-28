import { IsOptional, IsString } from 'class-validator';

// ประกาศใช้เองเพื่อให้ระบบ Build ผ่าน
export enum NutritionOrderStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Canceled = 'Canceled',
}

export class UpdateNutritionAppointmentDto {
  @IsOptional()
  @IsString()
  status?: NutritionOrderStatus;

  @IsOptional()
  @IsString()
  note?: string;
}