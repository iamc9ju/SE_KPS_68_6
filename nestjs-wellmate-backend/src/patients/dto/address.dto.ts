import { IsString, IsNotEmpty, IsOptional, MaxLength, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty({ description: 'Delivery address text', example: '123 Main St, Bangkok' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ description: 'Contact phone number', example: '0812345678' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone: string;

  @ApiProperty({ description: 'Address label (e.g. Home, Work)', example: 'Home' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  label: string;

  @ApiProperty({ description: 'Set as default address', example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateAddressDto {
  @ApiProperty({ description: 'Delivery address text', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: 'Contact phone number', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiProperty({ description: 'Address label', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  label?: string;

  @ApiProperty({ description: 'Set as default address', required: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
