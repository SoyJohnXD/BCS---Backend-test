import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { GetProductsUseCase } from '@/application/use-cases/get-products.use-case';
import { GetProductByIdUseCase } from '@/application/use-cases/get-product-by-id.use-case';
import { NotFoundException } from '@nestjs/common';

const mockGetProductsUseCase = {
  execute: jest.fn(),
};
const mockGetProductByIdUseCase = {
  execute: jest.fn(),
};

describe('ProductController', () => {
  let controller: ProductController;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        { provide: GetProductsUseCase, useValue: mockGetProductsUseCase },
        { provide: GetProductByIdUseCase, useValue: mockGetProductByIdUseCase },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProducts', () => {
    it('should call GetProductsUseCase.execute', async () => {
      const expectedResult = { products: [] };
      mockGetProductsUseCase.execute.mockResolvedValue(expectedResult);

      const result = await controller.getProducts();

      expect(mockGetProductsUseCase.execute).toHaveBeenCalledTimes(1);
      expect(result).toBe(expectedResult);
    });
  });

  describe('getProductById', () => {
    it('should call GetProductByIdUseCase.execute with the correct id', async () => {
      const id = 'a-valid-uuid';
      const expectedResult = {
        id,
        name: 'Test',
        shortDescription: 'Short',
        description: '...',
      };
      mockGetProductByIdUseCase.execute.mockResolvedValue(expectedResult);

      const result = await controller.getProductById(id);

      expect(mockGetProductByIdUseCase.execute).toHaveBeenCalledWith(id);
      expect(result).toBe(expectedResult);
    });

    it('should throw NotFoundException if use case returns null', async () => {
      const id = 'not-found-uuid';
      mockGetProductByIdUseCase.execute.mockResolvedValue(null);

      await expect(controller.getProductById(id)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockGetProductByIdUseCase.execute).toHaveBeenCalledWith(id);
    });
  });
});
