import {
  Controller,
  Req,
  Get,
  Post,
  Body,
  Query,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) { }

  // CREATE ACTIVITY
  @Post()
  create(
    @Body() dto: CreateCalendarDto,
    @Req() req: any
  ) {
    return this.calendarService.create(dto, req.user.sub);
  }

  // GET EVENTS
  @Get()
getEvents(
  @Req() req,
  @Query('start') start?: string,
  @Query('end') end?: string,
) {

  console.log("USER:", req.user);

  return this.calendarService.getEvents(req.user.sub, start, end);
}

  // GET DETAIL
  @Get(':id')
  getDetail(@Param('id') id: string, @Req() req) {
    return this.calendarService.getDetail(req.user.sub, id);
  }

  // UPDATE
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req,
    @Body() body: UpdateCalendarDto,
  ) {
    return this.calendarService.update(req.user.sub, id, body);
  }

  // DELETE
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.calendarService.remove(req.user.sub, id);
  }
}