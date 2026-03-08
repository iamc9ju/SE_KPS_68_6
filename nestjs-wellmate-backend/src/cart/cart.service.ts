import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AddToCartDto,
  CartResponseDto,
  UpdateCartItemDto,
} from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string): Promise<CartResponseDto> {
    const items = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        menuItem: true,
      },
    });

    const cartItems = items.map((item) => ({
      cartItemId: item.cartItemId,
      menuItemId: item.menuItemId,
      name: item.menuItem.name,
      price: Number(item.menuItem.price),
      quantity: item.quantity,
      imageUrl: item.menuItem.imageUrl,
    }));

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    return {
      items: cartItems,
      totalItems,
      totalAmount,
    };
  }

  async addItem(userId: string, dto: AddToCartDto): Promise<void> {
    const { menuItemId, quantity } = dto;

    const menuItem = await this.prisma.menuItem.findUnique({
      where: { menuItemId },
    });

    if (!menuItem) {
      throw new NotFoundException(`Menu item with ID ${menuItemId} not found`);
    }

    await this.prisma.cartItem.upsert({
      where: {
        userId_menuItemId: {
          userId,
          menuItemId,
        },
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      create: {
        userId,
        menuItemId,
        quantity,
      },
    });
  }

  async updateItem(
    userId: string,
    menuItemId: number,
    dto: UpdateCartItemDto,
  ): Promise<void> {
    const { quantity } = dto;

    await this.prisma.cartItem.update({
      where: {
        userId_menuItemId: {
          userId,
          menuItemId,
        },
      },
      data: { quantity },
    });
  }

  async removeItem(userId: string, menuItemId: number): Promise<void> {
    await this.prisma.cartItem.delete({
      where: {
        userId_menuItemId: {
          userId,
          menuItemId,
        },
      },
    });
  }

  async clear(userId: string): Promise<void> {
    await this.prisma.cartItem.deleteMany({
      where: { userId },
    });
  }
}
