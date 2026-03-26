import { PartialType } from '@nestjs/swagger';
import { CreateNutritionOrderDto } from './create-nutrition-order.dto';

export class UpdateNutritionOrderDto extends PartialType(CreateNutritionOrderDto) { }