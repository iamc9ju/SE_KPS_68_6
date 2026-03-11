import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Logger,
  Body,
  UsePipes,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiExcludeEndpoint } from '@nestjs/swagger';
import { WebhooksService, OmiseEventType } from './webhooks.service';

@ApiTags('Webhooks')
@Controller('webhooks/omise')
export class OmiseWebhookController {
  private readonly logger = new Logger(OmiseWebhookController.name);

  constructor(private readonly webhooksService: WebhooksService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiExcludeEndpoint()
  @UsePipes() // Bypass global ValidationPipe — Omise sends many extra fields
  @ApiOperation({
    summary: 'รับข้อมูล Omise Webhook (server-to-server)',
    description:
      'รับ event จาก Omise (เช่น charge.complete) เพื่ออัปเดตสถานะการนัดหมายในฐานข้อมูล — ไม่แสดงใน API Docs สาธารณะ',
  })
  async handleWebhook(@Body() payload: any) {
    this.logger.log(`Webhook received! key: ${payload?.key}`);

    if (!payload?.key || !payload?.data?.id) {
      this.logger.warn('Webhook received with missing key or data.id');
      return { received: true };
    }

    if (payload.key !== (OmiseEventType.CHARGE_COMPLETE as string)) {
      this.logger.debug(`Ignored webhook event: ${payload.key}`);
      return { received: true };
    }

    const chargeId = payload.data.id;
    this.logger.log(`Processing charge.complete for chargeId: ${chargeId}`);

    await this.webhooksService.processOmiseChargeComplete(chargeId);

    return { received: true };
  }
}
