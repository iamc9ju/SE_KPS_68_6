import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuItemDto } from './dto/create-food-menu.dto';
import { UpdateMenuItemDto } from './dto/update-food-menu.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class FoodMenuService {
  constructor(private prisma: PrismaService) {}

  // ✅ Create
  async create(dto: CreateMenuItemDto) {
    return this.prisma.menuItem.create({
      data: {
        ...dto,
        price: new Prisma.Decimal(dto.price),
        proteinG: dto.proteinG
          ? new Prisma.Decimal(dto.proteinG)
          : undefined,
        carbsG: dto.carbsG
          ? new Prisma.Decimal(dto.carbsG)
          : undefined,
        fatG: dto.fatG
          ? new Prisma.Decimal(dto.fatG)
          : undefined,
      },
    });
  }

  // ✅ Get All (พร้อม filter)
  async findAll(query: any) {
    return this.prisma.menuItem.findMany({
      where: {
        foodPartnerId: query.foodPartnerId
          ? Number(query.foodPartnerId)
          : undefined,

        isAvailable:
          query.isAvailable !== undefined
            ? query.isAvailable === 'true'
            : undefined,

        price: {
          gte: query.minPrice
            ? new Prisma.Decimal(query.minPrice)
            : undefined,
          lte: query.maxPrice
            ? new Prisma.Decimal(query.maxPrice)
            : undefined,
        },
      },
      include: {
        foodPartner: true,
      },
    });
  }

  // ✅ Get by ID
  async findOne(id: number) {
    const item = await this.prisma.menuItem.findUnique({
      where: { menuItemId: id },
      include: { foodPartner: true },
    });

    if (!item) {
      throw new NotFoundException('Menu item not found');
    }

    return item;
  }

  // ✅ Update
  async update(id: number, dto: UpdateMenuItemDto) {
    await this.findOne(id);

    return this.prisma.menuItem.update({
      where: { menuItemId: id },
      data: {
        ...dto,
        price: dto.price
          ? new Prisma.Decimal(dto.price)
          : undefined,
      },
    });
  }

  // ✅ Delete
  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.menuItem.delete({
      where: { menuItemId: id },
    });
  }
}