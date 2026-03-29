import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [ProgressController],
  providers: [ProgressService],
})
export class ProgressModule {}
