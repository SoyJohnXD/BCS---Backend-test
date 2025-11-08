import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from 'typeorm';
import { SqlProductRepository } from './sql-product.repository';
import { ProductSchema } from '../entities/product.schema';
import { Product } from '@/domain/entities/product.entity';
import { ProductMapper } from '../mappers/product.mapper';

type MockRepository<TEntity extends ObjectLiteral = ObjectLiteral> = Partial<
  Record<keyof Repository<TEntity>, jest.Mock>
>;

const createMockRepository = <
  TEntity extends ObjectLiteral,
>(): MockRepository<TEntity> => {
  return {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
  } as MockRepository<TEntity>;
};

const mockSchema: ProductSchema = {
  id: 'a-valid-uuid',
  name: 'Cuenta de Ahorros',
  description: 'Descripción completa',
  tasaInteres: 1.5,
  terminosCondiciones: 'Términos completos',
  requisitosElegibilidad: 'Requisitos completos',
  createdAt: new Date(),
};

const mockDomain = Product.fromPrimitives(mockSchema);

describe('SqlProductRepository', () => {
  let repository: SqlProductRepository;
  let typeOrmRepo: Required<MockRepository<ProductSchema>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SqlProductRepository,
        {
          provide: getRepositoryToken(ProductSchema),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    repository = module.get<SqlProductRepository>(SqlProductRepository);
    typeOrmRepo = module.get<MockRepository<ProductSchema>>(
      getRepositoryToken(ProductSchema),
    ) as Required<MockRepository<ProductSchema>>;
  });

  describe('findById', () => {
    it('should find a product and map it to domain', async () => {
      typeOrmRepo.findOne.mockResolvedValue(mockSchema);

      const result = await repository.findById('a-valid-uuid');

      expect(typeOrmRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'a-valid-uuid' },
      });
      expect(result).toBeInstanceOf(Product);
      if (!result) {
        throw new Error('Expected product to be returned');
      }
      expect(result.id).toBe(mockSchema.id);
      expect(result.tasaInteres).toBe(1.5);
    });

    it('should return null if product not found', async () => {
      typeOrmRepo.findOne.mockResolvedValue(null);

      const result = await repository.findById('not-found-uuid');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should find all products and map them to domain', async () => {
      const schemas = [mockSchema, mockSchema];
      typeOrmRepo.find.mockResolvedValue(schemas);

      const result = await repository.findAll();

      expect(typeOrmRepo.find).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Product);
      expect(result[0].id).toBe(mockSchema.id);
    });
  });

  describe('save', () => {
    it('should map a domain entity to schema and save it', async () => {
      const toPersistenceSpy = jest.spyOn(ProductMapper, 'toPersistence');

      await repository.save(mockDomain);

      expect(toPersistenceSpy).toHaveBeenCalledWith(mockDomain);
      expect(typeOrmRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockDomain.id,
          tasaInteres: mockDomain.tasaInteres,
        }),
      );

      toPersistenceSpy.mockRestore();
    });
  });
});
