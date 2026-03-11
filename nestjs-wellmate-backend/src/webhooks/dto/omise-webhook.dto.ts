import { IsString, IsNotEmpty } from 'class-validator';

export class OmiseWebhookDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsNotEmpty()
  data: any;
}
