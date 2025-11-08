import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from 'typeorm';
import { SqlOnboardingRepository } from './sql-onboarding.repository';
import {
  OnboardingRequestOrmEntity,
  OnboardingRequestSchema,
} from '../entities/onboarding-request.schema';
import { OnboardingRequest } from '@/domain/entities/onboarding-request.entity';
import { OnboardingMapper } from '../mappers/onboarding.mapper';
import { OnboardingStatus } from '@/domain/value-objects/onboarding-status.vo';

jest.mock('@/infrastructure/services/encryption.service', () => ({
  EncryptionService: jest.fn().mockImplementation(() => ({
    encrypt: jest.fn(),
    decrypt: jest.fn(),
  })),
}));

type MockRepository<TEntity extends ObjectLiteral = ObjectLiteral> = Partial<
  Record<keyof Repository<TEntity>, jest.Mock>
>;

const createMockRepository = <
  TEntity extends ObjectLiteral,
>(): MockRepository<TEntity> => {
  return {
    findOne: jest.fn(),
    save: jest.fn(),
  } as MockRepository<TEntity>;
};

const mockTimestamp = new Date('2024-01-01T00:00:00.000Z');

const mockSchema: OnboardingRequestOrmEntity = {
  id: 'a-valid-uuid',
  name: 'Test Client',
  documentNumber: '123456',
  email: 'test@bank.com',
  initialAmount: '100',
  status: OnboardingStatus.REQUESTED,
  createdAt: mockTimestamp,
  updatedAt: mockTimestamp,
};

const mockDomain = OnboardingRequest.fromPrimitives({
  id: mockSchema.id,
  name: mockSchema.name,
  documentNumber: mockSchema.documentNumber,
  email: mockSchema.email,
  initialAmount: Number(mockSchema.initialAmount),
  status: mockSchema.status,
  createdAt: mockTimestamp,
  updatedAt: mockTimestamp,
});

describe('SqlOnboardingRepository', () => {
  let repository: SqlOnboardingRepository;
  let typeOrmRepo: Required<MockRepository<OnboardingRequestOrmEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SqlOnboardingRepository,
        {
          provide: getRepositoryToken(OnboardingRequestSchema),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    repository = module.get<SqlOnboardingRepository>(SqlOnboardingRepository);
    typeOrmRepo = module.get<MockRepository<OnboardingRequestOrmEntity>>(
      getRepositoryToken(OnboardingRequestSchema),
    ) as Required<MockRepository<OnboardingRequestOrmEntity>>;
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findById', () => {
    it('should find a request and map it to domain', async () => {
      typeOrmRepo.findOne.mockResolvedValue(mockSchema);

      const result = await repository.findById('a-valid-uuid');

      expect(typeOrmRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'a-valid-uuid' },
      });
      expect(result).toBeInstanceOf(OnboardingRequest);
      if (!result) {
        throw new Error('Expected onboarding request to be returned');
      }
      expect(result.id).toBe(mockSchema.id);
    });

    it('should return null if request not found', async () => {
      typeOrmRepo.findOne.mockResolvedValue(null);

      const result = await repository.findById('not-found-uuid');

      expect(result).toBeNull();
    });
  });

  describe('save', () => {
    it('should map a domain entity to schema and save it', async () => {
      const toPersistenceSpy = jest.spyOn(OnboardingMapper, 'toPersistence');

      await repository.save(mockDomain);

      expect(toPersistenceSpy).toHaveBeenCalledWith(mockDomain);
      expect(typeOrmRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockDomain.id,
          email: mockDomain.email,
        }),
      );

      toPersistenceSpy.mockRestore();
    });
  });

  describe('update', () => {
    it('should map and persist changes', async () => {
      const toPersistenceSpy = jest.spyOn(OnboardingMapper, 'toPersistence');

      await repository.update(mockDomain);

      expect(toPersistenceSpy).toHaveBeenCalledWith(mockDomain);
      expect(typeOrmRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ id: mockDomain.id }),
      );

      toPersistenceSpy.mockRestore();
    });
  });
});
