import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth-guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import type { JwtPayload } from '../../auth/interface/jwt-payload.interface';
import { FoodpartnerOpeningHoursService } from './foodpartner-opening-hours.service';
import { UpdateOpeningHoursDto } from './dto/update-opening-hours.dto';

@ApiTags('Food Partner System')
@Controller('foodpartner_system/opening-hours')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class FoodpartnerOpeningHoursController {
  constructor(private readonly service: FoodpartnerOpeningHoursService) {}

  @Get()
  @Roles(UserRole.food_partner)
  @ApiOperation({ summary: 'Get opening hours (current user)' })
  @ApiResponse({ status: 200, description: 'Opening hours loaded' })
  getOpeningHours(@CurrentUser() user: JwtPayload) {
    return this.service.getOpeningHours(user.sub);
  }

  @Put()
  @Roles(UserRole.food_partner)
  @ApiOperation({ summary: 'Replace opening hours (current user)' })
  @ApiResponse({ status: 200, description: 'Opening hours updated' })
  updateOpeningHours(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateOpeningHoursDto,
  ) {
    return this.service.updateOpeningHours(user.sub, dto);
  }
}
