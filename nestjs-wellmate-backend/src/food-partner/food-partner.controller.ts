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
import { Prisma } from '@prisma/client';

@Controller('food-partner')
export class FoodPartnerController {
  constructor(private readonly foodPartnerService: FoodPartnerService) {}

  // ✅ Get all
  @Get()
  findAll() {
    return this.foodPartnerService.findAll();
  }

  // ✅ Get one
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.foodPartnerService.findOne(id);
  }

  // ✅ Update

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateFoodPartnerDto,  // ✅ ใช้ DTO
    ) {
    return this.foodPartnerService.update(id, data);
    }

  // ✅ Delete
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.foodPartnerService.remove(id);
  }
}