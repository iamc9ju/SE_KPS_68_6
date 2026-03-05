import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { NutritionistModule } from './nutritionist/nutritionist.module';
import { FoodPartnerModule } from './food-partner/food-partner.module';
import { FoodMenuModule } from './food-menu/food-menu.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    NutritionistModule,
    FoodPartnerModule,
    FoodMenuModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}