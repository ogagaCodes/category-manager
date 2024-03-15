import { IsNumber } from 'class-validator';

export class FetchSubtreeDto {
  @IsNumber()
  parentId: number;
}