import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateNotificationDto,
  NotificationResponseDto,
  RegisterDeviceDto,
} from './dto/notification.dto';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: NotificationsGateway,
  ) {}

  async create(dto: CreateNotificationDto): Promise<NotificationResponseDto> {
    const notification = await this.prisma.notification.create({
      data: {
        userId: dto.userId,
        type: dto.type,
        title: dto.title,
        content: dto.body,
      },
    });

    this.logger.log(
      `Notification created for user ${dto.userId}: ${dto.title}`,
    );

    this.gateway.sendToUser(dto.userId, 'notification', {
      notificationId: notification.notificationId,
      type: notification.type,
      title: notification.title,
      body: notification.content,
      createdAt: notification.createdAt,
    });

    return {
      notificationId: notification.notificationId,
      userId: notification.userId,
      type: notification.type,
      title: notification.title,
      body: notification.content,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
    };
  }

  async findAll(
    userId: string,
  ): Promise<{ unread: number; notifications: NotificationResponseDto[] }> {
    const [notifications, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      this.prisma.notification.count({
        where: { userId, isRead: false },
      }),
    ]);

    const mappedNotifications = notifications.map((n) => ({
      notificationId: n.notificationId,
      userId: n.userId,
      type: n.type,
      title: n.title,
      body: n.content,
      isRead: n.isRead,
      createdAt: n.createdAt,
    }));

    return {
      unread: unreadCount,
      notifications: mappedNotifications,
    };
  }

  async markAsRead(notificationId: string, userId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { notificationId, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async registerDevice(userId: string, dto: RegisterDeviceDto): Promise<void> {
    await this.prisma.deviceToken.upsert({
      where: { token: dto.token },
      update: { userId, platform: dto.platform },
      create: {
        userId,
        token: dto.token,
        platform: dto.platform,
      },
    });
  }
}
