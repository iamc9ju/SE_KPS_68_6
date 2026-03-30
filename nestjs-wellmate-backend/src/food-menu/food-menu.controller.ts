import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { FoodMenuService } from './food-menu.service';
import { FindMenuItemsQueryDto } from './dto/find-menu-items-query.dto';
import {
  CreateMenuItemDto,
  UpdateMenuItemDto,
} from './dto/menu-item-request.dto';
import {
  MenuItemResponseDto,
  PaginatedMenuItemsDto,
} from './dto/menu-item-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import type { JwtPayload } from '../auth/interface/jwt-payload.interface';

@ApiTags('Food / Menu Items')
@Controller('food-menu')
export class FoodMenuController {
  constructor(private readonly foodMenuService: FoodMenuService) {}

  @Get('categories')
  @ApiOperation({ summary: 'List all menu categories' })
  @ApiResponse({ status: 200, description: 'Return all categories' })
  async getCategories() {
    return this.foodMenuService.findAllCategories();
  }

  @Get()
  @ApiOperation({ summary: 'List all menu items with advanced filtering' })
  @ApiResponse({ status: 200, type: PaginatedMenuItemsDto })
  async findAll(@Query() query: FindMenuItemsQueryDto) {
    return this.foodMenuService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get detailed information for a specific menu item',
  })
  @ApiResponse({ status: 200, type: MenuItemResponseDto })
  @ApiNotFoundResponse({ description: 'Menu item not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.foodMenuService.findOne(id);
  }

  @Post('upload/image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.food_partner, UserRole.admin)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload an image for a menu item' })
  @ApiResponse({ status: 201, description: 'Image uploaded successfully' })
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.foodMenuService.uploadImage(file);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.food_partner, UserRole.admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new menu item' })
  @ApiResponse({ status: 201, type: MenuItemResponseDto })
  @ApiForbiddenResponse({ description: 'Only Food Partners can create items' })
  async create(
    @Body() createDto: CreateMenuItemDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.foodMenuService.create(createDto, user.sub);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.food_partner, UserRole.admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing menu item' })
  @ApiResponse({ status: 200, type: MenuItemResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateMenuItemDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.foodMenuService.update(id, updateDto, user.sub, user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.food_partner, UserRole.admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a menu item' })
  @ApiResponse({ status: 204, description: 'Successfully deleted' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    await this.foodMenuService.remove(id, user.sub, user.role);
    return { message: 'Item deleted successfully' };
  }
}
