import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from '../../src/application/category/controllers/category.controller';
import { CategoryService } from '../../src/application/category/services/category.service';
import { AddCategoryDto } from '../../src/Application/category/data/dto/addCategory.dto';
import { MoveSubtreeDto } from '../../src/Application/category/data/dto/moveSubtree.dto';
import Category from '../../src/application/category/data/interfaces/category.interface';

describe('CategoryController', () => {
  let controller: CategoryController;
  let categoryService: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: {
            addCategory: jest.fn(),
            removeCategory: jest.fn(),
            fetchSubtree: jest.fn(),
            moveSubtree: jest.fn(),
            fetchAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    categoryService = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addCategory', () => {
    it('should add a new category', async () => {
      const addCategoryDto: AddCategoryDto = { name: 'New Category', parentId: null };
      const newCategory: Category = { id: 1, name: 'New Category', children: [] };

      jest.spyOn(categoryService, 'addCategory')

      const result = await controller.addCategory(addCategoryDto);

      expect(result).toEqual(newCategory);
    });
  });


describe('removeCategory', () => {
    it('should remove a category', async () => {
      const categoryId = 1;

      jest.spyOn(categoryService, 'removeCategory').mockResolvedValueOnce(undefined);

      await controller.removeCategory(categoryId);

      expect(categoryService.removeCategory).toHaveBeenCalledWith({ categoryId });
    });
  });

  describe('fetchSubtree', () => {
    it('should fetch subtree of a category', async () => {
      const categoryId = 1;
      const childrenCategories: Category[] = [
        { id: 2, name: 'Child Category 1',  children: [{ id: categoryId, name: 'Parent Category', children: [] }] },
        { id: 3, name: 'Child Category 2',  children: [{ id: categoryId, name: 'Parent Category', children: [] }] },
      ];

      jest.spyOn(categoryService, 'fetchSubtree');

      const result = await controller.fetchSubtree(categoryId);

      expect(result).toEqual(childrenCategories);
    });
  });

  describe('moveSubtree', () => {
    it('should move a subtree', async () => {
      const parentId = 1;
      const moveSubtreeDto: MoveSubtreeDto = {
          categoryId: 2,
          parentId: 0
      }; // Assuming categoryId exists

      const movedCategory: Category = { id: 2, name: 'Moved Category', children: [] };

      jest.spyOn(categoryService, 'moveSubtree');

      const result = await controller.moveSubtree(parentId, moveSubtreeDto);

      expect(result).toEqual(movedCategory);
    });
  });

  describe('fetchAll', () => {
    it('should fetch all categories', async () => {
      let categories: Category[]
      jest.spyOn(categoryService, 'fetchAll');

      const result = await controller.fetchAll();

      expect(result).toEqual(categories);
    });
  });
});