import { Module } from '@nestjs/common';
import { TrackingGateway } from './tracking.gateway';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [
        PrismaModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
        }),
    ],
    providers: [TrackingGateway],
    exports: [TrackingGateway],
})
export class TrackingModule { }
