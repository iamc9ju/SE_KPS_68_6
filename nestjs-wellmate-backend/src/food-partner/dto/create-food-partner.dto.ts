import { IsString, IsUUID, IsOptional, IsNumber, IsDecimal } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateNutritionistDto {
  @IsUUID()
  userId: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @IsOptional()
  @IsString()
  licenseDocumentUrl?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  consultationFee?: number; // default จะเป็น 500 ถ้าไม่ส่งมา
}