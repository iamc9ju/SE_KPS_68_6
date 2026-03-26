import { Module } from '@nestjs/common';
import { NutritionOrdersService } from './nutrition-orders.service';
import { NutritionOrdersController } from './nutrition-orders.controller';
import { PrismaModule } from '../prisma/prisma.module'; // <--- 1. Import PrismaModule เข้ามา (เช็ค path ให้ตรงกับโฟลเดอร์ prisma ของคุณ)

@Module({
  imports: [PrismaModule], // <--- 2. เอา PrismaModule มาใส่ใน array ของ imports
  controllers: [NutritionOrdersController],
  providers: [NutritionOrdersService],
})
export class NutritionOrdersModule { }