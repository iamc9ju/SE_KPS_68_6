import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  MessageType,
  AppointmentStatus,
  NotificationType,
} from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async validateRoomAccess(
    chatRoomId: string,
    userId: string,
  ): Promise<boolean> {
    const room = await this.prisma.chatRoom.findUnique({
      where: { chatRoomId },
      include: {
        appointment: {
          select: {
            nutritionist: {
              select: { userId: true },
            },
            patient: {
              select: { userId: true },
            },
          },
        },
      },
    });

    if (!room || !room.appointment) return false;

    return (
      room.appointment.patient.userId === userId ||
      room.appointment.nutritionist.userId === userId
    );
  }

  async saveMessage(data: {
    chatRoomId: string;
    senderId: string;
    content: string;
    type: MessageType;
  }) {
    const message = await this.prisma.chatMessage.create({
      data: {
        chatRoomId: data.chatRoomId,
        senderId: data.senderId,
        content: data.content,
        messageType: data.type,
      },
      include: {
        sender: {
          include: {
            patient: true,
            nutritionist: true,
          },
        },
        chatRoom: {
          include: {
            appointment: {
              include: {
                patient: true,
                nutritionist: true,
              },
            },
          },
        },
      },
    });

    // @ts-ignore - Handle possible typing issues with deep includes
    const appt = message.chatRoom?.appointment;
    if (appt) {
      const recipientId =
        appt.patient?.userId === data.senderId
          ? appt.nutritionist?.userId
          : appt.patient?.userId;

      if (recipientId) {
        const senderName =
          // @ts-ignore
          message.sender.patient?.firstName ||
          // @ts-ignore
          message.sender.nutritionist?.firstName ||
          'Someone';

        await this.notificationsService.create({
          userId: recipientId,
          type: NotificationType.new_message,
          title: 'New Message',
          body: `${senderName} sent you a message: ${data.content.substring(0, 50)}${data.content.length > 50 ? '...' : ''}`,
        });
      }
    }

    return message;
  }

  async getMessages(chatRoomId: string, limit = 50, offset = 0) {
    return this.prisma.chatMessage.findMany({
      where: { chatRoomId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        sender: {
          select: {
            email: true,
            profileImageUrl: true,
            patient: { select: { firstName: true, lastName: true } },
            nutritionist: { select: { firstName: true, lastName: true } },
          },
        },
      },
    });
  }

  async getMyChatRooms(userId: string) {
    return this.prisma.chatRoom.findMany({
      where: {
        appointment: {
          OR: [{ patient: { userId } }, { nutritionist: { userId } }],
          status: AppointmentStatus.confirmed,
        },
      },
      include: {
        appointment: {
          select: {
            appointmentId: true,
            startTime: true,
            endTime: true,
            summary: true,
            nutritionistNotes: true,
            patient: {
              select: {
                firstName: true,
                lastName: true,
                user: { select: { profileImageUrl: true } },
              },
            },
            nutritionist: {
              select: {
                firstName: true,
                lastName: true,
                user: { select: { profileImageUrl: true } },
              },
            },
          },
        },
        chatMessages: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });
  }

  async markAsRead(chatRoomId: string, userId: string) {
    return this.prisma.chatMessage.updateMany({
      where: {
        chatRoomId,
        senderId: { not: userId },
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }
}
