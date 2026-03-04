import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { NutritionistService } from './nutritionist.service';
import { CreateNutritionistDto } from './dto/create-nutritionist.dto';
import { UpdateNutritionistDto } from './dto/update-nutritionist.dto';

@Controller('nutritionist')
export class NutritionistController {
  constructor(private readonly nutritionistService: NutritionistService) {}

  @Post()
  create(@Body() createNutritionistDto: CreateNutritionistDto) {
    return this.nutritionistService.create(createNutritionistDto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.nutritionistService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nutritionistService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNutritionistDto: UpdateNutritionistDto) {
    return this.nutritionistService.update(id, updateNutritionistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nutritionistService.remove(id);
  }
}
