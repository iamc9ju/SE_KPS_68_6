import { Controller, Get, Patch, Delete, Param, Query } from '@nestjs/common';
import { VerificationStatus } from '@prisma/client';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get('partners')
  getPartners() {
    return this.adminService.getPartners();
  }

  @Get('users')
  getUsers() {
    return this.adminService.getUsers();
  }

  @Get('nutritionists')
  getNutritionists(@Query('status') status?: VerificationStatus) {
    return this.adminService.getNutritionists(status);
  }

  @Patch('nutritionists/:id/approve')
  approveNutritionist(@Param('id') id: string) {
    return this.adminService.approveNutritionist(id);
  }

  @Patch('nutritionists/:id/reject')
  rejectNutritionist(@Param('id') id: string) {
    return this.adminService.rejectNutritionist(id);
  }

  @Patch('users/:id/activate')
  activateUser(@Param('id') id: string) {
    return this.adminService.setUserActive(id, true);
  }

  @Patch('users/:id/deactivate')
  deactivateUser(@Param('id') id: string) {
    return this.adminService.setUserActive(id, false);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  @Patch('partners/:id/activate')
  activatePartner(@Param('id') id: string) {
    return this.adminService.setPartnerActive(Number(id), true);
  }

  @Patch('partners/:id/deactivate')
  deactivatePartner(@Param('id') id: string) {
    return this.adminService.setPartnerActive(Number(id), false);
  }

  @Delete('partners/:id')
  deletePartner(@Param('id') id: string) {
    return this.adminService.deletePartner(Number(id));
  }
}
