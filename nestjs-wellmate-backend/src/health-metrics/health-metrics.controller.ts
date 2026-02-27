import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCookieAuth } from '@nestjs/swagger';
import { HealthMetricsService } from './health-metrics.service';
import { CreateHealthMetricDto } from './dto/create-health-metric.dto';
import { UpdateHealthMetricDto } from './dto/update-health-metric.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Patients / Health Metrics')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller('patients/health-metrics')
export class HealthMetricsController {
  constructor(private readonly healthMetricsService: HealthMetricsService) {}

  @Post()
  @ApiOperation({ summary: 'เพิ่มข้อมูลสุขภาพใหม่ (น้ำหนัก, ส่วนสูง, ไขมัน)' })
  async create(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateHealthMetricDto,
  ) {
    const data = await this.healthMetricsService.create(userId, dto);
    return {
      message: 'บันทึกข้อมูลสุขภาพสำเร็จ',
      data,
    };
  }

  @Get()
  @ApiOperation({ summary: 'ประวัติข้อมูลสุขภาพทั้งหมด เรียงจากล่าสุด' })
  async findAll(@CurrentUser('sub') userId: string) {
    const data = await this.healthMetricsService.findAll(userId);
    return {
      message: 'ดึงข้อมูลสุขภาพสำเร็จ',
      data,
    };
  }

  @Get('latest')
  @ApiOperation({ summary: 'ดึงข้อมูลสุขภาพล่าสุดที่เพิ่งบันทึกไป' })
  async findLatest(@CurrentUser('sub') userId: string) {
    const data = await this.healthMetricsService.findLatest(userId);
    return {
      message: 'ดึงข้อมูลสุขภาพล่าสุดสำเร็จ',
      data,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดูข้อมูลสุขภาพเฉพาะรายการตาม ID' })
  async findOne(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const data = await this.healthMetricsService.findOne(userId, id);
    return {
      message: 'ดึงข้อมูลสุขภาพสำเร็จ',
      data,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'แก้ไขข้อมูลสุขภาพตาม ID' })
  async update(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHealthMetricDto,
  ) {
    const data = await this.healthMetricsService.update(userId, id, dto);
    return {
      message: 'อัปเดตข้อมูลสุขภาพสำเร็จ',
      data,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'ลบข้อมูลสุขภาพตาม ID' })
  async remove(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const data = await this.healthMetricsService.remove(userId, id);
    return {
      message: 'ลบข้อมูลสุขภาพสำเร็จ',
      data,
    };
  }
}
