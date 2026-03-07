import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { FoodMenuService } from './food-menu.service';
import { CreateMenuItemDto } from './dto/create-food-menu.dto';
import { UpdateMenuItemDto } from './dto/update-food-menu.dto';

@Controller('food-menu')
export class FoodMenuController {
  constructor(private readonly foodMenuService: FoodMenuService) {}

  // ✅ CREATE
  @Post()
  create(@Body() dto: CreateMenuItemDto) {
    return this.foodMenuService.create(dto);
  }

  // ✅ GET ALL + FILTER
  @Get()
  findAll(@Query() query: any) {
    return this.foodMenuService.findAll(query);
  }

  // ✅ GET BY ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foodMenuService.findOne(Number(id));
  }

  // ✅ UPDATE
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMenuItemDto,
  ) {
    return this.foodMenuService.update(Number(id), dto);
  }

  // ✅ DELETE
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.foodMenuService.remove(Number(id));
  }
}