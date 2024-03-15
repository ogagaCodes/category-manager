import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../src/application/category/data/entities/category.entity'
import { AddCategoryDto } from '../../src/application/category/data/dto/addCategory.dto';
import { RemoveCategoryDto } from '../../src/application/category/data/dto/removeCategory.dto';
import { FetchSubtreeDto } from '../../src/application/category/data/dto/fetchSubTree.dto';
import { MoveSubtreeDto } from '../../src/application/category/data/dto/moveSubtree.dto';
import { CategoryService } from '../../src/application/category/services/category.service';

describe('CategoryService', () => {
    let service: CategoryService;
    let categoryRepository: Repository<Category>;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          CategoryService,
          {
            provide: getRepositoryToken(Category), // Use the correct token here
            useClass: Repository,
          },
        ],
      }).compile();
  
      service = module.get<CategoryService>(CategoryService);
      categoryRepository = module.get<Repository<Category>>(getRepositoryToken(Category));
    });
  
    it('should be defined', () => {
      expect(service).toBeDefined();
    });  

  describe('addCategory', () => {
    it('should add a new category', async () => {
      const addCategoryDto: AddCategoryDto = {
        name: 'New Category',
        parentId: null,
      };
      const newCategory: Category = {
        id: 1,
        name: 'New Category',
        parent: null,
        children: [],
      };

      jest.spyOn(categoryRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(categoryRepository, 'create').mockReturnValueOnce(newCategory);
      jest.spyOn(categoryRepository, 'save').mockResolvedValueOnce(newCategory);

      const result = await service.addCategory(addCategoryDto);

      expect(result).toEqual(newCategory);
    });

    it('should throw NotFoundException if parent category is not found', async () => {
      const addCategoryDto: AddCategoryDto = {
        name: 'New Category',
        parentId: 100,
      };

      jest.spyOn(categoryRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.addCategory(addCategoryDto)).rejects.toThrowError(
        'Parent category not found',
      );
    });

    it('should throw NotFoundException if category already exists', async () => {
      const addCategoryDto: AddCategoryDto = {
        name: 'Existing Category',
        parentId: null,
      };
      const existingCategory: Category = {
        id: 1,
        name: 'Existing Category',
        parent: null,
        children: [],
      };

      jest
        .spyOn(categoryRepository, 'findOne')
        .mockResolvedValueOnce(existingCategory);

      await expect(service.addCategory(addCategoryDto)).rejects.toThrowError(
        'Category already exists',
      );
    });
  });

  describe('removeCategory', () => {
    it('should remove a category and its children', async () => {
      const removeCategoryDto: RemoveCategoryDto = { categoryId: 1 };
      const categoryToRemove: Category = {
        id: 1,
        name: 'Category to remove',
        parent: null,
        children: [],
      };

      jest
        .spyOn(categoryRepository, 'findOne')
        .mockResolvedValueOnce(categoryToRemove);
      jest.spyOn(categoryRepository, 'remove').mockResolvedValueOnce(undefined);

      await service.removeCategory(removeCategoryDto);

      expect(categoryRepository.remove).toHaveBeenCalledWith(categoryToRemove);
    });

    it('should throw NotFoundException if category is not found', async () => {
      const removeCategoryDto: RemoveCategoryDto = { categoryId: 100 };

      jest.spyOn(categoryRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        service.removeCategory(removeCategoryDto),
      ).rejects.toThrowError('Category not found');
    });
  });

  describe('fetchSubtree', () => {
    it('should fetch subtree of a category', async () => {
      const fetchSubtreeDto: FetchSubtreeDto = { parentId: 1 };
      const parentCategory: Category = {
        id: 1,
        name: 'Parent Category',
        parent: null,
        children: [],
      };
      const childrenCategories: Category[] = [
        {
          id: 2,
          name: 'Child Category 1',
          parent: parentCategory,
          children: [],
        },
        {
          id: 3,
          name: 'Child Category 2',
          parent: parentCategory,
          children: [],
        },
      ];

      jest
        .spyOn(categoryRepository, 'findOne')
        .mockResolvedValueOnce(parentCategory);
      jest
        .spyOn(categoryRepository, 'find')
        .mockResolvedValueOnce(childrenCategories);

      const result = await service.fetchSubtree(fetchSubtreeDto);

      expect(result).toEqual(childrenCategories);
    });

    it('should throw NotFoundException if parent category is not found', async () => {
      const fetchSubtreeDto: FetchSubtreeDto = { parentId: 100 };

      jest.spyOn(categoryRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.fetchSubtree(fetchSubtreeDto)).rejects.toThrowError(
        'Parent category not found',
      );
    });
  });
});
