import { Module } from '@nestjs/common';
import { SchedulersService } from './schedulers.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  providers: [SchedulersService],
})
export class SchedulersModule {}
