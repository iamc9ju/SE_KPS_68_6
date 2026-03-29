import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus, PaymentStatus } from '@prisma/client';

class OrderItemResponseDto {
  @ApiProperty()
  orderItemId: number;

  @ApiProperty()
  menuItemId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  priceAtOrder: number;

  @ApiProperty()
  totalPrice: number;

  @ApiProperty({ required: false })
  imageUrl?: string;
}

class OrderPartnerResponseDto {
  @ApiProperty({ required: false })
  partnerName?: string;

  @ApiProperty({ required: false })
  address?: string;

  @ApiProperty({ required: false })
  addressLine1?: string;

  @ApiProperty({ required: false })
  district?: string;

  @ApiProperty({ required: false })
  province?: string;

  @ApiProperty({ required: false })
  latitude?: number;

  @ApiProperty({ required: false })
  longitude?: number;
}

export class OrderResponseDto {
  @ApiProperty()
  orderId: string;

  @ApiProperty()
  patientId: string;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty({ enum: OrderStatus })
  status: OrderStatus;

  @ApiProperty({ enum: PaymentStatus })
  paymentStatus: PaymentStatus;

  @ApiProperty()
  deliveryAddress: string;

  @ApiProperty({ required: false })
  deliveryLatitude?: number;

  @ApiProperty({ required: false })
  deliveryLongitude?: number;

  @ApiProperty()
  contactPhone: string;

  @ApiProperty({ required: false })
  qrCodeUrl?: string;

  @ApiProperty({ type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[];

  @ApiProperty({ type: OrderPartnerResponseDto, required: false })
  partner?: OrderPartnerResponseDto;

  @ApiProperty()
  createdAt: Date;
}
