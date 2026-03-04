import { Module } from '@nestjs/common';
import { NutritionistService } from './nutritionist.service';
import { NutritionistController } from './nutritionist.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NutritionistController],
  providers: [NutritionistService],
})
export class NutritionistModule {}