import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppointmentStatus } from '@prisma/client';

export enum OmiseEventType {
  CHARGE_COMPLETE = 'charge.complete',
}

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(private readonly prisma: PrismaService) {}

  async processOmiseChargeComplete(chargeId: string): Promise<void> {
    this.logger.log(
      `Processing Omise charge complete for chargeId: ${chargeId}`,
    );

    try {
      const appointment = await this.prisma.appointment.findUnique({
        where: { chargeId },
      });

      if (!appointment) {
        this.logger.warn(`No appointment found for chargeId: ${chargeId}`);
        return;
      }

      if (appointment.status === AppointmentStatus.confirmed) {
        this.logger.log(
          `Appointment ${appointment.appointmentId} is already confirmed. Skipping...`,
        );
        return;
      }

      await this.prisma.$transaction(async (tx) => {
        const updatedAppointment = await tx.appointment.update({
          where: { appointmentId: appointment.appointmentId },
          data: { status: AppointmentStatus.confirmed },
        });

        const existingChat = await tx.chatRoom.findUnique({
          where: { appointmentId: updatedAppointment.appointmentId },
        });

        if (!existingChat) {
          await tx.chatRoom.create({
            data: {
              appointmentId: updatedAppointment.appointmentId,
            },
          });
          this.logger.log(
            `Created ChatRoom for appointment ${updatedAppointment.appointmentId}`,
          );
        }

        return updatedAppointment;
      });

      this.logger.log(
        `SUCCESS: Updated appointment ${appointment.appointmentId} to confirmed`,
      );
      return;
    } catch (error) {
      this.logger.error(`Error processing appointment for ${chargeId}:`, error);
    }

    // If not an appointment, check if it's an Order
    try {
      const order = await this.prisma.order.findUnique({
        where: { chargeId },
      });

      if (order) {
        this.logger.log(`Found Order for chargeId: ${chargeId}`);

        if (order.paymentStatus === 'PAID') {
          this.logger.log(
            `Order ${order.orderId} is already PAID. Skipping...`,
          );
          return;
        }

        await this.prisma.order.update({
          where: { orderId: order.orderId },
          data: {
            paymentStatus: 'PAID',
            status: 'accepted', // Auto-accept after paid?
          },
        });

        this.logger.log(`SUCCESS: Updated order ${order.orderId} to PAID`);
        return;
      }
    } catch (error) {
      this.logger.error(`Error processing order for ${chargeId}:`, error);
    }

    this.logger.warn(`No appointment or order found for chargeId: ${chargeId}`);
  }
}
