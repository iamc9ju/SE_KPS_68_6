import { Module } from '@nestjs/common';
import { NutritionAppointmentsService } from './nutrition-appointments.service';
import { NutritionAppointmentsController } from './nutrition-appointments.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NutritionAppointmentsController],
  providers: [NutritionAppointmentsService],
  exports: [NutritionAppointmentsService]
})
export class NutritionAppointmentsModule { } // เปลี่ยนชื่อจาก AppointmentsModule เป็นชื่อนี้ตามที่ app.module เรียกใช้