import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NutritionOrdersService } from './nutrition-orders.service';
import { CreateNutritionOrderDto } from './dto/create-nutrition-order.dto';
import { UpdateNutritionOrderDto } from './dto/update-nutrition-order.dto';

@Controller('nutrition-orders')
export class NutritionOrdersController {
  constructor(private readonly nutritionOrdersService: NutritionOrdersService) { }

  @Post()
  create(@Body() createNutritionOrderDto: CreateNutritionOrderDto) {
    return this.nutritionOrdersService.create(createNutritionOrderDto);
  }

  @Get()
  findAll() {
    return this.nutritionOrdersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) { // <--- สังเกตว่ารับเป็น string
    return this.nutritionOrdersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNutritionOrderDto: UpdateNutritionOrderDto) { // <--- สังเกตว่ารับเป็น string
    return this.nutritionOrdersService.update(id, updateNutritionOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) { // <--- สังเกตว่ารับเป็น string
    return this.nutritionOrdersService.remove(id);
  }
}