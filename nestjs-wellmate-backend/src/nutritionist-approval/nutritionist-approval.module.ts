import { Module } from '@nestjs/common';
import { NutritionistApprovalService } from './nutritionist-approval.service';
import { NutritionistApprovalController } from './nutritionist-approval.controller';
import { PrismaService } from '../prisma/prisma.service'; // ⚠️ เช็ค path ตรงนี้ให้ตรงกับที่อยู่ไฟล์ prisma.service.ts ของคุณด้วยนะครับ

@Module({
  controllers: [NutritionistApprovalController],
  providers: [
    NutritionistApprovalService,
    PrismaService // ต้องใส่ PrismaService ตรงนี้ด้วย Service ของเราถึงจะคุยกับ Database ได้
  ],
})
export class NutritionistApprovalModule { }