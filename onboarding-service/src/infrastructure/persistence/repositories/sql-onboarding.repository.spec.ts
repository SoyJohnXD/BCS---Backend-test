import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SqlOnboardingRepository } from './sql-onboarding.repository';
import { OnboardingRequestSchema } from '../entities/onboarding-request.schema';
import { OnboardingRequest } from '@/domain/entities/onboarding-request.entity';
import { OnboardingMapper } from '../mappers/onboarding.mapper';
import { OnboardingStatus } from '@/domain/value-objects/onboarding-status.vo';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = (): MockRepository<OnboardingRequestSchema> => ({
  findOne: jest.fn(),
  save: jest.fn(),
});

const mockSchema: OnboardingRequestSchema = {
  id: 'a-valid-uuid',
  nombre: 'Cliente Prueba',
  documento: '123456',
  email: 'test@bank.com',
  montoInicial: 100,
  status: OnboardingStatus.REQUESTED,
  createdAt: new Date(),
};

const mockDomain = OnboardingRequest.fromPrimitives(mockSchema);

describe('SqlOnboardingRepository', () => {
  let repository: SqlOnboardingRepository;
  let typeOrmRepo: MockRepository<OnboardingRequestSchema>;

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
    typeOrmRepo = module.get<MockRepository<OnboardingRequestSchema>>(
      getRepositoryToken(OnboardingRequestSchema),
    );
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
});
