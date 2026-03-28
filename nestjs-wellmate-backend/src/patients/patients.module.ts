import { Module } from '@nestjs/common';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { HealthProfileController } from './health-profile.controller';
import { HealthProfileService } from './health-profile.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PatientsController, HealthProfileController],
  providers: [PatientsService, HealthProfileService],
})
export class PatientsModule { }