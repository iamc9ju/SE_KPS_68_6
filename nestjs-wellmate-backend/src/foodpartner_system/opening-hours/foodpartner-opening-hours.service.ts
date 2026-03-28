import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateOpeningHoursDto } from './dto/update-opening-hours.dto';

@Injectable()
export class FoodpartnerOpeningHoursService {
  constructor(private readonly prisma: PrismaService) {}

  private async getPartnerIdByUserId(userId: string) {
    const partner = await this.prisma.foodPartner.findUnique({
      where: { userId },
      select: { foodPartnerId: true },
    });

    if (!partner) {
      throw new NotFoundException('Food Partner not found');
    }

    return partner.foodPartnerId;
  }

  async getOpeningHours(userId: string) {
    const foodPartnerId = await this.getPartnerIdByUserId(userId);
    return this.prisma.foodPartnerOpeningHour.findMany({
      where: { foodPartnerId },
      orderBy: { dayOfWeek: 'asc' },
      include: { slots: { orderBy: { sequence: 'asc' } } },
    });
  }

  async updateOpeningHours(userId: string, dto: UpdateOpeningHoursDto) {
    const foodPartnerId = await this.getPartnerIdByUserId(userId);

    await this.prisma.$transaction(async (tx) => {
      await tx.foodPartnerOpeningSlot.deleteMany({
        where: { openingHour: { foodPartnerId } },
      });
      await tx.foodPartnerOpeningHour.deleteMany({
        where: { foodPartnerId },
      });

      for (const day of dto.days) {
        const createdHour = await tx.foodPartnerOpeningHour.create({
          data: {
            foodPartnerId,
            dayOfWeek: day.dayOfWeek,
            isOpen: day.isOpen,
          },
        });

        const slots = (day.slots ?? []).map((slot, index) => ({
          openingHourId: createdHour.foodPartnerOpeningHourId,
          startTime: slot.startTime,
          endTime: slot.endTime,
          sequence: slot.sequence ?? index + 1,
        }));

        if (slots.length > 0) {
          await tx.foodPartnerOpeningSlot.createMany({ data: slots });
        }
      }
    });

    return this.getOpeningHours(userId);
  }
}
