import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuItemDto } from './create-food-menu.dto';

export class UpdateMenuItemDto extends PartialType(CreateMenuItemDto) {}