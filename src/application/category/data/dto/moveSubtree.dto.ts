import { IsNumber } from 'class-validator';

export class MoveSubtreeDto {
  @IsNumber()
  parentId: number;

  @IsNumber()
  categoryId: number;
}