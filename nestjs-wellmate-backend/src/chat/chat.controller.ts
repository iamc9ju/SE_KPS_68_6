import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  ForbiddenException,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import type { Express } from 'express';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get('rooms')
  @ApiOperation({ summary: 'รายการห้องแชททั้งหมดของผู้ใช้' })
  @ApiResponse({ status: 200, description: 'คืนค่ารายการห้องแชทที่เกี่ยวข้อง' })
  async getMyRooms(@CurrentUser('sub') userId: string) {
    return this.chatService.getMyChatRooms(userId);
  }

  @Get(':chatRoomId/messages')
  @ApiOperation({ summary: 'ดึงประวัติข้อความในห้องแชท' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'คืนค่ารายการข้อความ' })
  @ApiResponse({
    status: 403,
    description: 'ผู้ใช้ไม่มีสิทธิ์เข้าถึงห้องแชทนี้',
  })
  async getMessages(
    @Param('chatRoomId') chatRoomId: string,
    @CurrentUser('sub') userId: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
  ) {
    const hasAccess = await this.chatService.validateRoomAccess(
      chatRoomId,
      userId,
    );

    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this chat room');
    }

    return this.chatService.getMessages(chatRoomId, limit || 50, offset || 0);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'อัปโหลดรูปภาพที่ใช้ในแชท' })
  async uploadChatImage(
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('No image file provided');
    }
    const result = await this.cloudinaryService.uploadImage(file);
    return {
      message: 'Upload successful',
      data: {
        imageUrl: (result as any).secure_url,
      },
    };
  }
}
