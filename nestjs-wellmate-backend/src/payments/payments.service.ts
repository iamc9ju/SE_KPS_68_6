import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ErrorMessages } from '../common/constants/response.constants';
import {
  IOmiseClient,
  OmiseCurrency,
  OmiseSourceType,
} from './types/omise.type';
// @ts-ignore
import omise from 'omise';

@Injectable()
export class PaymentsService {
  private readonly omiseClient: IOmiseClient;

  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.get<string>('OMISE_SECRET_KEY');
    const publicKey = this.configService.get<string>('OMISE_PUBLIC_KEY');

    if (!secretKey || !publicKey) {
      throw new InternalServerErrorException('Omise keys are not configured');
    }

    this.omiseClient = (omise as any)({
      publicKey,
      secretKey,
    });
  }

  async createPromptPayCharge(
    amount: number,
    metadata: Record<string, unknown>,
  ): Promise<{ chargeId: string; qrCodeUrl: string }> {
    try {
      const amountInSubunit = Math.round(amount * 100);

      const charge = await this.omiseClient.charges.create({
        amount: amountInSubunit,
        currency: OmiseCurrency.THB,
        source: {
          type: OmiseSourceType.PROMPTPAY,
        },
        metadata: metadata as Record<string, string>,
      });

      if (!charge.id || !charge.source?.scannable_code?.image?.download_uri) {
        throw new InternalServerErrorException(
          'Failed to generate PromptPay QR code',
        );
      }

      return {
        chargeId: charge.id,
        qrCodeUrl: charge.source.scannable_code.image.download_uri,
      };
    } catch (error) {
      console.error('Omise charge error:', error);
      throw new InternalServerErrorException(ErrorMessages.PROCESSING_ERROR);
    }
  }

  async retrieveCharge(chargeId: string) {
    try {
      return await this.omiseClient.charges.retrieve(chargeId);
    } catch {
      throw new InternalServerErrorException(
        'Failed to retrieve payment details',
      );
    }
  }
}
