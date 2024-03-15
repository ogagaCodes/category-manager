import { IsNumber } from 'class-validator';

export class RemoveCategoryDto {
  @IsNumber()
  categoryId: number;
}