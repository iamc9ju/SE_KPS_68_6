import { Controller, Get, Patch, Param, Delete, Body, Query } from '@nestjs/common';
import { NutritionAppointmentsService } from './nutrition-appointments.service';
import { UpdateNutritionAppointmentDto } from './dto/update-nutrition-appointment.dto';

@Controller('nutrition-appointments')
export class NutritionAppointmentsController {
  constructor(private readonly service: NutritionAppointmentsService) { }

  @Get()
  findAll(@Query('status') status?: string, @Query('search') search?: string) {
    return this.service.findAll(status, search);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateNutritionAppointmentDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}