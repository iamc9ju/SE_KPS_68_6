import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // ตรวจสอบ path ของ PrismaService ให้ตรงด้วยนะครับ

@Injectable()
export class NutritionistApprovalService {
    constructor(private prisma: PrismaService) { }

    // 1. API ดึงรายชื่อนักโภชนาการทั้งหมด (หรือจะกรองเฉพาะ pending ก็ได้)
    async findAll() {
        return this.prisma.nutritionist.findMany({
            include: {
                user: {
                    select: { email: true, phone: true },
                },
            },
            orderBy: { createdAt: 'desc' }, // เรียงจากสมัครล่าสุด
        });
    }

    // 2. API อัปเดตสถานะ (อนุมัติ/ปฏิเสธ)
    // เดี๋ยวเราต้องใช้ UpdateApprovalDto เข้ามาช่วย
    async updateStatus(id: string, status: any) {
        const nutritionist = await this.prisma.nutritionist.findUnique({
            where: { nutritionistId: id },
        });

        if (!nutritionist) {
            throw new NotFoundException('ไม่พบข้อมูลนักโภชนาการท่านนี้');
        }

        return this.prisma.nutritionist.update({
            where: { nutritionistId: id },
            data: {
                verificationStatus: status,
                verifiedAt: status === 'approved' ? new Date() : null, // ถ้าอนุมัติให้เก็บเวลาปัจจุบัน
            },
        });
    }
}