import { Controller, Get } from '@nestjs/common';
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
}
