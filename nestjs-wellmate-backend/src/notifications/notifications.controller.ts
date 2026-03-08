import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { RegisterDeviceDto } from './dto/notification.dto';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    role: string;
  };
}

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notifications for current user' })
  @ApiResponse({
    status: 200,
    description: 'Return notification history and unread count.',
  })
  findAll(@Req() req: AuthenticatedRequest) {
    return this.notificationsService.findAll(req.user.userId);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiResponse({
    status: 200,
    description: 'Notification updated successfully.',
  })
  markAsRead(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.notificationsService.markAsRead(id, req.user.userId);
  }

  @Post('mark-all-read')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 200, description: 'All notifications updated.' })
  markAllAsRead(@Req() req: AuthenticatedRequest) {
    return this.notificationsService.markAllAsRead(req.user.userId);
  }

  @Post('register-device')
  @ApiOperation({ summary: 'Register a device token for push notifications' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Device registered successfully.',
  })
  registerDevice(
    @Body() dto: RegisterDeviceDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.notificationsService.registerDevice(req.user.userId, dto);
  }
}
