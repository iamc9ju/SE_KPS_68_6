import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateNutritionAppointmentDto } from './dto/update-nutrition-appointment.dto';

@Injectable()
export class NutritionAppointmentsService {
  constructor(private prisma: PrismaService) { }

  async findAll(status?: string, search?: string) {
    return this.prisma.appointment.findMany({
      where: {
        ...(status && status !== 'all' ? { status: status as any } : {}),
        OR: search ? [
          // ลบการค้นหาด้วย appointmentId ออก เอาไว้แค่ค้นหาด้วยชื่อและนามสกุลคนไข้
          { patient: { first_name: { contains: search, mode: 'insensitive' } } },
          { patient: { last_name: { contains: search, mode: 'insensitive' } } }
        ] : undefined,
      },
      include: {
        patient: {
          select: {
            first_name: true,
            last_name: true
          }
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, updateDto: UpdateNutritionAppointmentDto) {
    return this.prisma.appointment.update({
      where: { appointmentId: id },
      data: {
        ...updateDto,
        // ถ้า status ยังแดงอยู่ ให้ระบุเจาะจงลงไปแบบนี้:
        status: updateDto.status as any,
      },
    });
  }

  async remove(id: string) {
    try {
      return await this.prisma.appointment.delete({
        where: { appointmentId: id }, // Schema ใช้ชื่อ appointmentId
      });
    } catch (error) {
      throw new NotFoundException(`ไม่พบรายการไอดี ${id} เพื่อลบ`);
    }
  }
}