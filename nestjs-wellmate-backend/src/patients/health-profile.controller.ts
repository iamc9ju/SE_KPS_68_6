import { Controller, Get, Req, UnauthorizedException } from '@nestjs/common';
import { HealthProfileService } from './health-profile.service';

@Controller('api/body-info')
export class HealthProfileController {
    constructor(private readonly healthProfileService: HealthProfileService) { }

    @Get()
    async getMyBodyInfo(@Req() req: any) {
        // โค้ดสำหรับระบบ Login (ตอนนี้คอมเมนต์ไว้ก่อน)
        // let userId = req.user?.userId || req.user?.id; 

        // ** โค้ดสำหรับทดสอบ (เปิดใช้งานแล้ว) **
        // ⚠️ สำคัญมาก: ให้คุณเอา ID ของคนไข้ (patient) ที่มีอยู่จริงในฐานข้อมูลมาใส่แทนข้อความภาษาไทยข้างล่างนี้นะครับ
        let userId = "1234";

        if (!userId) {
            throw new UnauthorizedException('Please login first or provide a valid user ID');
        }

        return this.healthProfileService.getBodyInfo(userId);
    }
}