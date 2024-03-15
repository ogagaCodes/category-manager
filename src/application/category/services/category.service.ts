import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../data/entities/category.entity';
import { AddCategoryDto } from '../data/dto/addCategory.dto';
import { RemoveCategoryDto } from '../data/dto/removeCategory.dto';
import { FetchSubtreeDto } from '../data/dto/fetchSubTree.dto';
import { MoveSubtreeDto } from '../data/dto/moveSubtree.dto';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CATEGORY_REPOSITORY')
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async addCategory(addCategoryDto: AddCategoryDto): Promise<Category> {
    const { name, parentId } = addCategoryDto;

    let parentCategory: Category | undefined;
    if (parentId) {
      parentCategory = await this.categoryRepository.findOne({
        where: { id: parentId },
      });
      if (!parentCategory) {
        throw new NotFoundException('Parent category not found');
      }
    }

    const existingCategory = await this.categoryRepository.findOne({
      where: { name, parent: parentCategory },
    });
    if (existingCategory) {
      throw new NotFoundException('Category already exists');
    }

    const newCategory = this.categoryRepository.create({
      name,
      parent: parentCategory,
    });
    return this.categoryRepository.save(newCategory);
  }

  async removeCategory(removeCategoryDto: RemoveCategoryDto): Promise<void> {
    const { categoryId } = removeCategoryDto;
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    await this.removeChildren(category);
    await this.categoryRepository.remove(category);
  }

  private async removeChildren(category: Category): Promise<void> {
    if (category.children && category.children.length > 0) {
      for (const child of category.children) {
        await this.removeChildren(child);
        await this.categoryRepository.remove(child);
      }
    }
  }

  async fetchSubtree(fetchSubtreeDto: FetchSubtreeDto): Promise<Category[]> {
    const { parentId } = fetchSubtreeDto;
    const parentCategory = await this.categoryRepository.findOne({
      where: { id: parentId },
    });

    if (!parentCategory) {
      throw new NotFoundException('Parent category not found');
    }
    const children = await this.categoryRepository.find({
      where: { parent: parentCategory },
    });
    return children;
  }

  async moveSubtree(moveSubtreeDto: MoveSubtreeDto): Promise<Category> {
    const { parentId, categoryId } = moveSubtreeDto;
    const parentCategory = await this.categoryRepository.findOne({
      where: { id: parentId },
    });
    if (!parentCategory) {
      throw new NotFoundException('Parent category not found');
    }

    const category = await this.categoryRepository.findOne({
      where: { id: parentId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Check if moving to a descendant category
    let currentParent = parentCategory;
    while (currentParent) {
      if (currentParent.id === categoryId) {
        throw new BadRequestException(
          'Cannot move category to its own descendant',
        );
      }
      currentParent = currentParent.parent;
    }

    category.parent = parentCategory;
    return this.categoryRepository.save(category);
  }

  //   utility method
  async fetchAll(): Promise<Category[]> {
    const categories = await this.categoryRepository.find();
    return categories;
  }
}
