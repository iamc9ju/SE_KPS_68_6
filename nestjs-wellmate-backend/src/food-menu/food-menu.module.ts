import { Module } from '@nestjs/common';
import { FoodMenuService } from './food-menu.service';
import { FoodMenuController } from './food-menu.controller';

@Module({
  providers: [FoodMenuService],
  controllers: [FoodMenuController]
})
export class FoodMenuModule {}
