import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsUrl,
  IsInt,
  Min,
  Max,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMenuItemDto {
  @ApiProperty({ example: 'Grilled Chicken Salad' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Fresh greens with grilled organic chicken' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 150.0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 'https://cdn.wellmate.com/images/salad.jpg' })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional({ example: 'Salad' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 450 })
  @IsOptional()
  @IsInt()
  @Min(0)
  caloriesKcal?: number;

  @ApiPropertyOptional({ example: 25.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  proteinG?: number;

  @ApiPropertyOptional({ example: 15.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  carbsG?: number;

  @ApiPropertyOptional({ example: 10.2 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  fatG?: number;

  @ApiPropertyOptional({ example: ['nuts', 'dairy'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allergens?: string[];

  @ApiPropertyOptional({ example: 'Contains nuts and dairy.' })
  @IsOptional()
  @IsString()
  allergenAlert?: string;

  @ApiPropertyOptional({ default: 100 })
  @IsOptional()
  @IsInt()
  @Min(0)
  stockQuantity?: number;
}

export class UpdateMenuItemDto extends CreateMenuItemDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isOutOfStock?: boolean;
}
