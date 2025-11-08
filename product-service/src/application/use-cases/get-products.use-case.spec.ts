import { Test, TestingModule } from '@nestjs/testing';
import { GetProductsUseCase } from './get-products.use-case';
import { IProductRepository } from '@/domain/repositories/product.repository';
import { ICacheService } from '../ports/cache.port';
import { Product } from '@/domain/entities/product.entity';
import { ProductListDto } from '../dto/product-list.dto';

const mockProductRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  save: jest.fn(),
};

const mockCacheService = {
  get: jest.fn(),
  set: jest.fn(),
};

const mockProduct = Product.create({
  name: 'Cuenta de Ahorros',
  description: 'Descripción completa',
  tasaInteres: 1.5,
  terminosCondiciones: 'Términos completos',
  requisitosElegibilidad: 'Requisitos completos',
});

(mockProduct as any)._id = 'a-valid-uuid';

const mockProducts = [mockProduct];

const expectedDto: ProductListDto = {
  products: [
    {
      id: 'a-valid-uuid',
      name: 'Cuenta de Ahorros',
    },
  ],
};
const cacheKey = 'all_products_summary';

describe('GetProductsUseCase', () => {
  let useCase: GetProductsUseCase;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetProductsUseCase,
        { provide: IProductRepository, useValue: mockProductRepository },
        { provide: ICacheService, useValue: mockCacheService },
      ],
    }).compile();

    useCase = module.get<GetProductsUseCase>(GetProductsUseCase);
  });

  it('should fetch from repository, save to cache, and return summary DTO on cache miss', async () => {
    mockCacheService.get.mockResolvedValue(null);
    mockProductRepository.findAll.mockResolvedValue(mockProducts);
    mockCacheService.set.mockResolvedValue(undefined);

    const result = await useCase.execute();

    expect(mockCacheService.get).toHaveBeenCalledWith(cacheKey);

    expect(mockProductRepository.findAll).toHaveBeenCalledTimes(1);

    expect(mockCacheService.set).toHaveBeenCalledWith(
      cacheKey,
      JSON.stringify(expectedDto),
      3600,
    );

    expect(result).toEqual(expectedDto);
  });

  it('should fetch from cache and not call repository on cache hit', async () => {
    const cachedData = JSON.stringify(expectedDto);
    mockCacheService.get.mockResolvedValue(cachedData);

    const result = await useCase.execute();

    expect(mockCacheService.get).toHaveBeenCalledWith(cacheKey);

    expect(mockProductRepository.findAll).not.toHaveBeenCalled();

    expect(mockCacheService.set).not.toHaveBeenCalled();

    expect(result).toEqual(expectedDto);
  });
});
