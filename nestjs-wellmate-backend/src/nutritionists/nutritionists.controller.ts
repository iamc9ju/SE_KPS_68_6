import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { NutritionistsService } from './nutritionists.service';
import { NutritionistLeavesService } from './nutritionist-leaves.service';
import { NutritionistSchedulesService } from './nutritionist-schedules.service';
import { FindNutritionistsQueryDto } from './dto/find-nutritionists-query.dto';
import { GetAvailabilityDto } from './dto/get-availability.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/interface/jwt-payload.interface';
import { CreateNutritionistDto } from './dto/create-nutritionist.dto';
import { UpdateNutritionistDto } from './dto/update-nutritionist.dto';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Nutritionists')
@Controller('nutritionists')
export class NutritionistsController {
  constructor(
    private nutritionistsService: NutritionistsService,
    private nutritionistLeavesService: NutritionistLeavesService,
    private nutritionistSchedulesService: NutritionistSchedulesService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'ค้นหานักโภชนาการ (สามารถกรอง กรองเรียงลำดับ ได้)' })
  @ApiResponse({
    status: 200,
    description: 'ค้นหาสำเร็จ คืนค่ารายการนักโภชนาการพร้อม pagination',
  })
  async findAll(@Query() query: FindNutritionistsQueryDto) {
    return this.nutritionistsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดึงข้อมูลนักโภชนาการตาม ID พร้อมรีวิวและบริการ' })
  @ApiResponse({ status: 200, description: 'ดึงข้อมูลสำเร็จ' })
  @ApiResponse({ status: 404, description: 'ไม่พบนักโภชนาการ' })
  async findOne(@Param('id') id: string) {
    return this.nutritionistsService.findOne(id);
  }

  @Get(':id/availability')
  @ApiOperation({ summary: 'ดูเวลาที่เปิดรับจอง (Availability) ในวันที่กำหนด' })
  @ApiResponse({
    status: 200,
    description: 'คืนค่าช่วงเวลาที่ว่างสำหรับการจอง',
  })
  async getAvailability(
    @Param('id') id: string,
    @Query() query: GetAvailabilityDto,
  ) {
    return this.nutritionistsService.getAvailability(id, query.date);
  }

  @Post('me/schedules')
  @ApiBearerAuth()
  @Auth(UserRole.nutritionist)
  @ApiOperation({ summary: 'เพิ่มเวลาทำงาน (เฉพาะนักโภชนาการ)' })
  @ApiResponse({ status: 201, description: 'เพิ่มเวลาทำงานสำเร็จ' })
  @ApiResponse({
    status: 403,
    description: 'ไม่มีสิทธิ์เข้าถึง (ต้องเป็น Nutritionist)',
  })
  async createSchedule(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateScheduleDto,
  ) {
    return this.nutritionistSchedulesService.createSchedule(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/leaves')
  @ApiBearerAuth()
  @Auth(UserRole.nutritionist)
  @ApiOperation({ summary: 'เพิ่มวันลา/เวลาที่ลางาน (เฉพาะนักโภชนาการ)' })
  @ApiResponse({ status: 201, description: 'บันทึกวันลาสำเร็จ' })
  @ApiResponse({
    status: 403,
    description: 'ไม่มีสิทธิ์เข้าถึง (ต้องเป็น Nutritionist)',
  })
  async createLeave(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateLeaveDto,
  ) {
    return this.nutritionistLeavesService.createLeave(userId, dto);
  }

  @Post()
  @Auth(UserRole.admin)
  @ApiOperation({ summary: 'ลงทะเบียนนักโภชนาการใหม่ (Admin only)' })
  @ApiResponse({ status: 201, description: 'สร้างสำเร็จ' })
  async create(@Body() dto: CreateNutritionistDto) {
    return this.nutritionistsService.create(dto);
  }

  @Patch(':id')
  @Auth(UserRole.admin, UserRole.nutritionist)
  @ApiOperation({ summary: 'แก้ไขข้อมูลนักโภชนาการ' })
  @ApiResponse({ status: 200, description: 'อัปเดตสำเร็จ' })
  async update(@Param('id') id: string, @Body() dto: UpdateNutritionistDto) {
    return this.nutritionistsService.update(id, dto);
  }

  @Delete(':id')
  @Auth(UserRole.admin)
  @ApiOperation({ summary: 'ลบข้อมูลนักโภชนาการ (Soft delete)' })
  @ApiResponse({ status: 200, description: 'ลบสำเร็จ' })
  async remove(@Param('id') id: string) {
    return this.nutritionistsService.remove(id);
  }
}
