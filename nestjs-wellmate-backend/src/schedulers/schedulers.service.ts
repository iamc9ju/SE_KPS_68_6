import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '@prisma/client';
import { addMinutes, subMinutes } from 'date-fns';

@Injectable()
export class SchedulersService {
  private readonly logger = new Logger(SchedulersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) { }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleAppointmentReminders() {
    this.logger.log('Running appointment reminders cron job...');

    const now = new Date();
    const thirtyMinutesFromNow = addMinutes(now, 30);
    const windowStart = subMinutes(thirtyMinutesFromNow, 2);
    const windowEnd = addMinutes(thirtyMinutesFromNow, 3);

    try {
      const upcomingAppointments = await this.prisma.appointment.findMany({
        where: {
          startTime: {
            gte: windowStart,
            lte: windowEnd,
          },
          status: 'confirmed',
        },
        include: {
          patient: {
            include: {
              user: true,
            },
          },
          nutritionist: true,
        },
      });

      this.logger.log(
        `Found ${upcomingAppointments.length} upcoming appointments for reminders.`,
      );

      for (const appt of upcomingAppointments) {
        // ✅ แก้ไข: เปลี่ยน appt.nutritionist.firstName เป็น name
        await this.notificationsService.create({
          userId: appt.patient.userId,
          type: NotificationType.appointment_reminder,
          title: 'Consultation Starting Soon',
          body: `Your appointment with ${appt.nutritionist.first_name} starts in 30 minutes.`,
        });

        // ✅ แก้ไข: เปลี่ยน appt.patient.firstName เป็น name (และใช้ as any เพื่อกัน Type บ่น)
        await this.notificationsService.create({
          userId: appt.nutritionist.userId,
          type: NotificationType.appointment_reminder,
          title: 'Upcoming Consultation',
          body: `Your appointment with ${(appt.patient as any).name} starts in 30 minutes.`,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(
        'Error running appointment reminders cron:',
        errorMessage,
      );
    }
  }
}