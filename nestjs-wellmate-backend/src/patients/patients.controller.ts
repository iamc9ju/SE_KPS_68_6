import { Body, Controller, Get, Post, Put, Delete, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { CompleteProfileDto } from './dto/complete-profile.dto';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';
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

  // --- Address Management ---

  @Get('addresses')
  @Auth(UserRole.patient)
  @ApiOperation({ summary: 'ดึงรายการที่อยู่จัดส่งที่บันทึกไว้' })
  async getAddresses(@CurrentUser('sub') userId: string) {
    return this.patientsService.getAddresses(userId);
  }

  @Post('addresses')
  @Auth(UserRole.patient)
  @ApiOperation({ summary: 'เพิ่มที่อยู่จัดส่งใหม่' })
  async addAddress(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateAddressDto,
  ) {
    return this.patientsService.addAddress(userId, dto);
  }

  @Put('addresses/:id')
  @Auth(UserRole.patient)
  @ApiOperation({ summary: 'แก้ไขที่อยู่จัดส่ง' })
  async updateAddress(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseIntPipe) addressId: number,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.patientsService.updateAddress(userId, addressId, dto);
  }

  @Delete('addresses/:id')
  @Auth(UserRole.patient)
  @ApiOperation({ summary: 'ลบที่อยู่จัดส่ง' })
  async deleteAddress(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseIntPipe) addressId: number,
  ) {
    return this.patientsService.deleteAddress(userId, addressId);
  }
}
