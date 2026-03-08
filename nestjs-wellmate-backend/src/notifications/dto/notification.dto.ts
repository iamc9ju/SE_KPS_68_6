import { IsString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType, Platform } from '@prisma/client';

export class CreateNotificationDto {
  @ApiProperty({ example: '0622b656-56df-479a-86d9-bebd84bf73e5' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ enum: NotificationType })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ example: 'Consultation Reminder' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Your appointment starts in 30 minutes.' })
  @IsString()
  @IsNotEmpty()
  body: string;
}

export class RegisterDeviceDto {
  @ApiProperty({ example: 'expo-token-abc-123' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ enum: Platform })
  @IsEnum(Platform)
  platform: Platform;
}

export class NotificationResponseDto {
  @ApiProperty()
  notificationId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ enum: NotificationType })
  type: NotificationType;

  @ApiProperty()
  title: string;

  @ApiProperty()
  body: string;

  @ApiProperty()
  isRead: boolean;

  @ApiProperty()
  createdAt: Date;
}
