import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UpdateFoodPartnerDto } from './dto/update-food-partner.dto';

@Injectable()
export class FoodPartnerService {
  constructor(private prisma: PrismaService) {}

  // ✅ Find all
  async findAll() {
    return this.prisma.foodPartner.findMany({
      include: {
        menuItems: true,
      },
    });
  }

  // ✅ Find one
  async findOne(id: number) {
    const partner = await this.prisma.foodPartner.findUnique({
      where: { foodPartnerId: id },
      include: {
        menuItems: true,
      },
    });

    if (!partner) {
      throw new NotFoundException('Food Partner not found');
    }

    return partner;
  }

  // ✅ Update
  async update(id: number, dto: UpdateFoodPartnerDto) {
    return this.prisma.foodPartner.update({
        where: { foodPartnerId: id },
        data: {
        ...dto,
        rating: dto.rating !== undefined
            ? new Prisma.Decimal(dto.rating)
            : undefined,
        commissionRate: dto.commissionRate !== undefined
            ? new Prisma.Decimal(dto.commissionRate)
            : undefined,
        },
    });
    }

  // ✅ Delete
  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.foodPartner.delete({
      where: { foodPartnerId: id },
    });
  }
}