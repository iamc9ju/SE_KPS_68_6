import { Module } from '@nestjs/common';
import { FoodMenuService } from './food-menu.service';
import { FoodMenuController } from './food-menu.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FoodMenuController],
  providers: [FoodMenuService],
  exports: [FoodMenuService],
})
export class FoodMenuModule {}
