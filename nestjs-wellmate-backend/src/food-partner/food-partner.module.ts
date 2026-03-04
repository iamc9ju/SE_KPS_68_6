import { Module } from '@nestjs/common';
import { FoodPartnerService } from './food-partner.service';
import { FoodPartnerController } from './food-partner.controller';

@Module({
  providers: [FoodPartnerService],
  controllers: [FoodPartnerController]
})
export class FoodPartnerModule {}
