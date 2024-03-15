import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddCategoryDto {

  @ApiProperty({
    type: String,
  }) 
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    type: Number,
  })
  parentId?: number; // Optional field for specifying the parent category ID
}