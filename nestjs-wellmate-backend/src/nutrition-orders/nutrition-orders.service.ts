import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNutritionOrderDto } from './dto/create-nutrition-order.dto';
import { UpdateNutritionOrderDto } from './dto/update-nutrition-order.dto';

@Injectable()
export class NutritionOrdersService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateNutritionOrderDto) {
    return this.prisma.order.create({
      data: dto as any,
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const data = await this.prisma.order.findUnique({
      where: { orderId: id },
    });
    if (!data) throw new NotFoundException('ไม่พบออเดอร์');
    return data;
  }

  async update(id: string, dto: UpdateNutritionOrderDto) {
    return this.prisma.order.update({
      where: { orderId: id },
      data: dto as any,
    });
  }

  async remove(id: string) {
    return this.prisma.order.delete({
      where: { orderId: id },
    });
  }
} // ตรวจสอบว่ามีปีกกาปิด Class ตรงนี้