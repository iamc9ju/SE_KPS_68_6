import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Auth } from '../auth/decorators/auth.decorator';
import { ProgressService } from './progress.service';
import { CreateProgressEntryDto } from './dto/create-progress-entry.dto';
import { UploadProgressPhotoDto } from './dto/upload-progress-photo.dto';

@ApiTags('Patients / Progress')
@ApiBearerAuth()
@Controller('patients/progress')
@Auth(UserRole.patient)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  @ApiOperation({ summary: 'ดึงภาพรวม progress ล่าสุดของผู้ป่วย' })
  @ApiResponse({ status: 200, description: 'ดึง progress overview สำเร็จ' })
  async getOverview(@CurrentUser('sub') userId: string) {
    const data = await this.progressService.getOverview(userId);
    return {
      message: 'ดึง progress overview สำเร็จ',
      data,
    };
  }

  @Get('history')
  @ApiOperation({ summary: 'ดึงประวัติ progress และ health metrics สำหรับกราฟ' })
  @ApiResponse({ status: 200, description: 'ดึงประวัติ progress สำเร็จ' })
  async getHistory(@CurrentUser('sub') userId: string) {
    const data = await this.progressService.getHistory(userId);
    return {
      message: 'ดึงประวัติ progress สำเร็จ',
      data,
    };
  }

  @Post()
  @ApiOperation({ summary: 'บันทึก progress entry ใหม่' })
  @ApiResponse({ status: 201, description: 'บันทึก progress สำเร็จ' })
  async createEntry(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateProgressEntryDto,
  ) {
    const data = await this.progressService.createEntry(userId, dto);
    return {
      message: 'บันทึก progress สำเร็จ',
      data,
    };
  }

  @Get('photos')
  @ApiOperation({ summary: 'ดึงรูป progress ทั้งหมดของผู้ป่วย' })
  @ApiResponse({ status: 200, description: 'ดึงรูป progress สำเร็จ' })
  async getPhotos(@CurrentUser('sub') userId: string) {
    const data = await this.progressService.getPhotos(userId);
    return {
      message: 'ดึงรูป progress สำเร็จ',
      data,
    };
  }

  @Post('photos')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'อัปโหลดรูป progress' })
  @ApiResponse({ status: 201, description: 'อัปโหลดรูป progress สำเร็จ' })
  async uploadPhoto(
    @CurrentUser('sub') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Query() dto: UploadProgressPhotoDto,
  ) {
    const data = await this.progressService.uploadPhoto(userId, dto, file);
    return {
      message: 'อัปโหลดรูป progress สำเร็จ',
      data,
    };
  }
}
