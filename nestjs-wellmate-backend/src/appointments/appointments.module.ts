import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { AppointmentExpiryService } from './appointment-expiry.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [PrismaModule, PaymentsModule],
  providers: [AppointmentsService, AppointmentExpiryService],
  controllers: [AppointmentsController],
})
export class AppointmentsModule {}
