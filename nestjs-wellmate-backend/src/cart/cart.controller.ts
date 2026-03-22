import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import {
  AddToCartDto,
  CartResponseDto,
  UpdateCartItemDto,
} from './dto/cart.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user cart' })
  @ApiResponse({ status: 200, type: CartResponseDto })
  async findAll(@CurrentUser('sub') userId: string) {
    return this.cartService.findAll(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Add an item to cart' })
  async addItem(@CurrentUser('sub') userId: string, @Body() dto: AddToCartDto) {
    return this.cartService.addItem(userId, dto);
  }

  @Patch(':menuItemId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  async updateItem(
    @CurrentUser('sub') userId: string,
    @Param('menuItemId', ParseIntPipe) menuItemId: number,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(userId, menuItemId, dto);
  }

  @Delete(':menuItemId')
  @ApiOperation({ summary: 'Remove an item from cart' })
  async removeItem(
    @CurrentUser('sub') userId: string,
    @Param('menuItemId', ParseIntPipe) menuItemId: number,
  ) {
    return this.cartService.removeItem(userId, menuItemId);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear entire cart' })
  async clear(@CurrentUser('sub') userId: string) {
    return this.cartService.clear(userId);
  }
}
