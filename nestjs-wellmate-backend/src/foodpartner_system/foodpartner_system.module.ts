import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { FoodpartnerProfileController } from './profile/foodpartner-profile.controller';
import { FoodpartnerProfileService } from './profile/foodpartner-profile.service';
import { FoodpartnerOpeningHoursController } from './opening-hours/foodpartner-opening-hours.controller';
import { FoodpartnerOpeningHoursService } from './opening-hours/foodpartner-opening-hours.service';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [FoodpartnerProfileController, FoodpartnerOpeningHoursController],
  providers: [FoodpartnerProfileService, FoodpartnerOpeningHoursService],
})
export class FoodpartnerSystemModule {}
