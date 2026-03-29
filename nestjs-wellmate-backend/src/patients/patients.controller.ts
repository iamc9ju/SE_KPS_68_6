import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { CompleteProfileDto } from './dto/complete-profile.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Auth } from '../auth/decorators/auth.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';

@ApiTags('Patients')
@ApiBearerAuth()
@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
@Auth(UserRole.patient)
export class PatientsController {
  constructor(private patientsService: PatientsService) {}

  @Post('complete-profile')
  @ApiOperation({ summary: 'เพิ่มข้อมูลส่วนตัวของคนไข้ให้สมบูรณ์' })
  @ApiResponse({ status: 201, description: 'บันทึกข้อมูลสำเร็จ' })
  async completeProfile(
    @Body() dto: CompleteProfileDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.patientsService.completeProfile(userId, dto);
  }

  @Get('profile')
  @ApiOperation({ summary: 'ดึงข้อมูลโปรไฟล์ของคนไข้' })
  @ApiResponse({ status: 200, description: 'ดึงข้อมูลโปรไฟล์สำเร็จ' })
  async getProfile(@CurrentUser('sub') userId: string) {
    return this.patientsService.getProfile(userId);
  }

  @Get()
  @Auth(UserRole.admin, UserRole.nutritionist)
  @ApiOperation({ summary: 'ดึงข้อมูลคนไข้ทั้งหมด (สำหรับ Admin และ Nutritionist)' })
  async findAll() {
    return this.patientsService.findAll();
  }
}
