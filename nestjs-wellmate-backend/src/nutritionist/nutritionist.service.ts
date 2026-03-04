import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNutritionistDto } from './dto/create-nutritionist.dto';
import { UpdateNutritionistDto } from './dto/update-nutritionist.dto';

@Injectable()
export class NutritionistService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateNutritionistDto) {
    return this.prisma.nutritionist.create({
      data: dto,
    });
  }

  async findAll(query: any) {
  return this.prisma.nutritionist.findMany({
    where: {
      deletedAt: null,

      // ค้นหาชื่อ
      OR: query.search
        ? [
            {
              firstName: {
                contains: query.search,
                mode: 'insensitive',
              },
            },
            {
              lastName: {
                contains: query.search,
                mode: 'insensitive',
              },
            },
          ]
        : undefined,

      // filter ค่าปรึกษา
      consultationFee: {
        gte: query.minFee ? Number(query.minFee) : undefined,
        lte: query.maxFee ? Number(query.maxFee) : undefined,
      },
    },
  });
}

  async findOne(id: string) {
    const nutritionist = await this.prisma.nutritionist.findUnique({
      where: {
        nutritionistId: id,
      },
    });

    if (!nutritionist) {
      throw new NotFoundException('Nutritionist not found');
    }

    return nutritionist;
  }

  async update(id: string, dto: UpdateNutritionistDto) {
    await this.findOne(id); // เช็คว่ามีอยู่จริง

    return this.prisma.nutritionist.update({
      where: {
        nutritionistId: id,
      },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    // Soft delete
    return this.prisma.nutritionist.update({
      where: {
        nutritionistId: id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}