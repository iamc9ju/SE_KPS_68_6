import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
import { FoodpartnerProfileService } from './foodpartner-profile.service';
import { UpdateFoodPartnerProfileDto } from './dto/update-food-partner-profile.dto';
import type { Express } from 'express';

@ApiTags('Food Partner System')
@Controller('foodpartner_system/profile')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class FoodpartnerProfileController {
  constructor(private readonly service: FoodpartnerProfileService) {}

  @Get()
  @Roles(UserRole.food_partner)
  @ApiOperation({ summary: 'Get food partner profile (current user)' })
  @ApiResponse({ status: 200, description: 'Profile loaded' })
  getProfile(@CurrentUser() user: JwtPayload) {
    return this.service.getProfile(user.sub);
  }

  @Patch()
  @Roles(UserRole.food_partner)
  @ApiOperation({ summary: 'Update food partner profile (current user)' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateFoodPartnerProfileDto,
  ) {
    return this.service.updateProfile(user.sub, dto);
  }

  @Post('logo')
  @Roles(UserRole.food_partner)
  @UseInterceptors(FileInterceptor('file'))
  uploadLogo(
    @CurrentUser() user: JwtPayload,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.uploadAndUpdate(
      user.sub,
      file,
      'logoUrl',
      'food_partners/logo',
    );
  }

  @Post('cover')
  @Roles(UserRole.food_partner)
  @UseInterceptors(FileInterceptor('file'))
  uploadCover(
    @CurrentUser() user: JwtPayload,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.uploadAndUpdate(
      user.sub,
      file,
      'coverImageUrl',
      'food_partners/cover',
    );
  }

  @Post('bank-document')
  @Roles(UserRole.food_partner)
  @UseInterceptors(FileInterceptor('file'))
  uploadBankDocument(
    @CurrentUser() user: JwtPayload,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.uploadAndUpdate(
      user.sub,
      file,
      'bankDocumentUrl',
      'food_partners/bank_docs',
    );
  }

  @Post('business-document')
  @Roles(UserRole.food_partner)
  @UseInterceptors(FileInterceptor('file'))
  uploadBusinessDocument(
    @CurrentUser() user: JwtPayload,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.uploadAndUpdate(
      user.sub,
      file,
      'businessDocumentUrl',
      'food_partners/business_docs',
    );
  }
}
