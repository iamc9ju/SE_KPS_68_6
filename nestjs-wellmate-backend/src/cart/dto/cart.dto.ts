import { IsInt, IsNotEmpty, IsPositive, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  menuItemId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  @Min(1)
  quantity: number;
}

export class UpdateCartItemDto {
  @ApiProperty({ example: 2 })
  @IsInt()
  @IsPositive()
  @Min(1)
  quantity: number;
}

export class CartItemResponseDto {
  @ApiProperty()
  cartItemId: string;

  @ApiProperty()
  menuItemId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty({ required: false, nullable: true })
  imageUrl?: string | null;
}

export class CartResponseDto {
  @ApiProperty({ type: [CartItemResponseDto] })
  items: CartItemResponseDto[];

  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  totalAmount: number;
}
