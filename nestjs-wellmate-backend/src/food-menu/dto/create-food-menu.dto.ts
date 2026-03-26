import {
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  IsNumber,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMenuItemDto {

  @IsInt()
  foodPartnerId: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  price: number;   // ✅ เพิ่มตรงนี้

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsInt()
  caloriesKcal?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  proteinG?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  carbsG?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  fatG?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allergens?: string[];

  @IsOptional()
  @IsString()
  allergenAlert?: string;

  @IsOptional()
  @IsInt()
  stockQuantity?: number;

  @IsOptional()
  @IsBoolean()
  isOutOfStock?: boolean;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
