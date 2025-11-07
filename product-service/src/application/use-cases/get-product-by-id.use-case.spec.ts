import { Test, TestingModule } from '@nestjs/testing';
import { GetProductByIdUseCase } from './get-product-by-id.use-case';
import { IProductRepository } from '@/domain/repositories/product.repository';
import { ICacheService } from '../ports/cache.port';
import { Product } from '@/domain/entities/product.entity';
import { ProductDto } from '../dto/product.dto';

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
  nombre: 'Cuenta de Ahorros',
  descripcion: 'Descripción completa',
  tasaInteres: 1.5,
  terminosCondiciones: 'Términos completos',
  requisitosElegibilidad: 'Requisitos completos',
});
const mockId = 'a-valid-uuid';
(mockProduct as any)._id = mockId;

const expectedDto: ProductDto = {
  id: mockId,
  nombre: 'Cuenta de Ahorros',
  descripcion: 'Descripción completa',
  tasaInteres: 1.5,
  terminosCondiciones: 'Términos completos',
  requisitosElegibilidad: 'Requisitos completos',
};
const cacheKey = `product_detail:${mockId}`;

describe('GetProductByIdUseCase', () => {
  let useCase: GetProductByIdUseCase;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetProductByIdUseCase,
        { provide: IProductRepository, useValue: mockProductRepository },
        { provide: ICacheService, useValue: mockCacheService },
      ],
    }).compile();

    useCase = module.get<GetProductByIdUseCase>(GetProductByIdUseCase);
  });

  it('should fetch from repository, save to cache, and return full DTO on cache miss', async () => {
    mockCacheService.get.mockResolvedValue(null);
    mockProductRepository.findById.mockResolvedValue(mockProduct);
    mockCacheService.set.mockResolvedValue(undefined);

    const result = await useCase.execute(mockId);

    expect(mockCacheService.get).toHaveBeenCalledWith(cacheKey);
    expect(mockProductRepository.findById).toHaveBeenCalledWith(mockId);
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

    const result = await useCase.execute(mockId);

    expect(mockCacheService.get).toHaveBeenCalledWith(cacheKey);
    expect(mockProductRepository.findById).not.toHaveBeenCalled();
    expect(mockCacheService.set).not.toHaveBeenCalled();
    expect(result).toEqual(expectedDto);
  });

  it('should return null if not found in cache or repository', async () => {
    mockCacheService.get.mockResolvedValue(null);
    mockProductRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute(mockId);

    expect(mockCacheService.get).toHaveBeenCalledWith(cacheKey);
    expect(mockProductRepository.findById).toHaveBeenCalledWith(mockId);
    expect(mockCacheService.set).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });
});
