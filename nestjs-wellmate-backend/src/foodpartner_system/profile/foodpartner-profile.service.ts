import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import type { Express } from 'express';
import { Prisma } from '@prisma/client';
import { UpdateFoodPartnerProfileDto } from './dto/update-food-partner-profile.dto';

@Injectable()
export class FoodpartnerProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getProfile(userId: string) {
    const partner = await this.prisma.foodPartner.findUnique({
      where: { userId },
      include: {
        openingHours: {
          orderBy: { dayOfWeek: 'asc' },
          include: { slots: { orderBy: { sequence: 'asc' } } },
        },
      },
    });

    if (!partner) {
      throw new NotFoundException('Food Partner not found');
    }

    return partner;
  }

  async updateProfile(userId: string, dto: UpdateFoodPartnerProfileDto) {
    const partner = await this.prisma.foodPartner.findUnique({
      where: { userId },
      select: { foodPartnerId: true },
    });

    if (!partner) {
      throw new NotFoundException('Food Partner not found');
    }

    const updateData: Prisma.FoodPartnerUpdateInput = {
      ...dto,
      holidayClosures:
        dto.holidayClosures === undefined
          ? undefined
          : (dto.holidayClosures as Prisma.InputJsonValue),
    };

    return this.prisma.foodPartner.update({
      where: { userId },
      data: updateData,
    });
  }

  async uploadAndUpdate(
    userId: string,
    file: Express.Multer.File,
    field:
      | 'logoUrl'
      | 'coverImageUrl'
      | 'bankDocumentUrl'
      | 'businessDocumentUrl',
    folder: string,
  ) {
    const partner = await this.prisma.foodPartner.findUnique({
      where: { userId },
      select: { foodPartnerId: true },
    });

    if (!partner) {
      throw new NotFoundException('Food Partner not found');
    }

    const uploadResult = await this.cloudinaryService.uploadFile(
      file,
      folder,
      'auto',
    );
    const url = (uploadResult as { secure_url?: string }).secure_url;
    if (!url) {
      throw new NotFoundException('Upload failed');
    }

    await this.prisma.foodPartner.update({
      where: { userId },
      data: { [field]: url },
    });

    return { url };
  }
}
