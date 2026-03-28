import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNutritionistDto } from './dto/create-nutritionist.dto';
import { UpdateNutritionistDto } from './dto/update-nutritionist.dto';

@Injectable()
export class NutritionistService {
  constructor(private prisma: PrismaService) { }

  // เปลี่ยน type dto เป็น any ชั่วคราว เพื่อแก้ปัญหา DTO ฟิลด์ไม่ครบกับ Prisma
  async create(dto: any) {
    return this.prisma.nutritionist.create({
      data: dto,
    });
  }

  async findAll(query: any) {
    return this.prisma.nutritionist.findMany({
      where: {
        deletedAt: null,

        // ค้นหาชื่อ (ลบ lastName ทิ้งไปแล้ว ค้นหาแค่จาก name อย่างเดียว)
        firstName: query.search
          ? {
            contains: query.search,
            mode: 'insensitive',
          }
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
      // ใช้ as any เพื่อให้ Prisma ไม่บ่นตอนอัปเดตข้อมูลเผื่อ DTO ไม่ตรง
      data: dto as any,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    // Soft delete (สำหรับ Nutritionist โค้ดเดิมยังเก็บ deletedAt ไว้อยู่ เราเลยใช้ Soft delete ได้ตามปกติครับ)
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