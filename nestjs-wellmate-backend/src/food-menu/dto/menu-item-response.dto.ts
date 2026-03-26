import { ApiProperty } from '@nestjs/swagger';

class FoodPartnerSummaryDto {
  @ApiProperty()
  foodPartnerId: number;

  @ApiProperty()
  partnerName: string;
}

export class MenuItemResponseDto {
  @ApiProperty()
  menuItemId: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  price: number;

  @ApiProperty({ required: false })
  imageUrl?: string;

  @ApiProperty({ required: false })
  category?: string;

  @ApiProperty({ required: false })
  caloriesKcal?: number;

  @ApiProperty({ required: false })
  proteinG?: number;

  @ApiProperty({ required: false })
  carbsG?: number;

  @ApiProperty({ required: false })
  fatG?: number;

  @ApiProperty({ required: false, type: [String] })
  allergens?: string[];

  @ApiProperty({ required: false })
  allergenAlert?: string;

  @ApiProperty()
  isAvailable: boolean;

  @ApiProperty()
  isOutOfStock: boolean;

  @ApiProperty({ type: FoodPartnerSummaryDto })
  foodPartner: FoodPartnerSummaryDto;
}

export class PaginatedMenuItemsDto {
  @ApiProperty({ type: [MenuItemResponseDto] })
  data: MenuItemResponseDto[];

  @ApiProperty()
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
