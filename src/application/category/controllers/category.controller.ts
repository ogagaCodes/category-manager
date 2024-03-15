import { Controller, Post, Body, Delete, Param, Get, Put } from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { AddCategoryDto } from '../data/dto/addCategory.dto';
import { MoveSubtreeDto } from '../data/dto/moveSubtree.dto';
import { Category } from '../data/entities/category.entity';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async addCategory(@Body() addCategoryDto: AddCategoryDto): Promise<Category> {
    return this.categoryService.addCategory(addCategoryDto);
  }

  @Delete(':id')
  async removeCategory(@Param('id') id: number): Promise<void> {
    return this.categoryService.removeCategory({ categoryId: id });
  }

  @Get(':id/subtree')
  async fetchSubtree(@Param('id') id: number): Promise<Category[]> {
    return this.categoryService.fetchSubtree({ parentId: id });
  }

  @Put(':id/move')
  async moveSubtree(@Param('id') id: number, @Body() moveSubtreeDto: MoveSubtreeDto): Promise<Category> {
    return this.categoryService.moveSubtree({ parentId: id, ...moveSubtreeDto });
  }

  @Get()
  async fetchAll(): Promise<Category[]> {
    return this.categoryService.fetchAll();
  }
}