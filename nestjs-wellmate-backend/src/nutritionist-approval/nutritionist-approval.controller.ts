import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { NutritionistApprovalService } from './nutritionist-approval.service';
// import { UpdateApprovalDto } from './dto/update-approval.dto';

@Controller('nutritionist-approval')
export class NutritionistApprovalController {
  constructor(private readonly approvalService: NutritionistApprovalService) { }

  // รับ GET Request ที่ /nutritionist-approval
  @Get()
  getAllNutritionists() {
    return this.approvalService.findAll();
  }

  // รับ PATCH Request ที่ /nutritionist-approval/:id
  @Patch(':id')
  updateApprovalStatus(
    @Param('id') id: string,
    @Body('status') status: string, // รับค่า status มาจาก Body (เดี๋ยวเราค่อยผูก DTO ทีหลัง)
  ) {
    return this.approvalService.updateStatus(id, status);
  }
}