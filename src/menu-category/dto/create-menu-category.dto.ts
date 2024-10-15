import { Optional } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMenuCategoryDto {
  @IsString()
  @IsNotEmpty()
  categoryName: string;

  @IsString()
  @Optional()
  description: string;
}
