import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { FoodPartnerService } from './food-partner.service';
import { UpdateFoodPartnerDto } from './dto/update-food-partner.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Food / Partners')
@Controller('food-partner')
export class FoodPartnerController {
  constructor(private readonly foodPartnerService: FoodPartnerService) {}

  @Get()
  @ApiOperation({ summary: 'ดึงรายชื่อพาร์ทเนอร์ร้านอาหารทั้งหมด' })
  @ApiResponse({ status: 200, description: 'ดึงข้อมูลสำเร็จ' })
  findAll() {
    return this.foodPartnerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดูรายละเอียดพาร์ทเนอร์ร้านอาหารรายรายการ' })
  @ApiResponse({ status: 200, description: 'ดึงข้อมูลสำเร็จ' })
  @ApiResponse({ status: 404, description: 'ไม่พบร้านอาหาร' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.foodPartnerService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'แก้ไขข้อมูลพาร์ทเนอร์ร้านอาหาร' })
  @ApiResponse({ status: 200, description: 'อัปเดตสำเร็จ' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateFoodPartnerDto,
  ) {
    return this.foodPartnerService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'ลบร้านอาหารพาร์ทเนอร์' })
  @ApiResponse({ status: 200, description: 'ลบสำเร็จ' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.foodPartnerService.remove(id);
  }
}
