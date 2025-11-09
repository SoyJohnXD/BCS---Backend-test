import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateOnboardingUseCase } from './create-onboarding.use-case';
import { IOnboardingRepository } from '@/domain/repositories/onboarding.repository';
import { IValidationApiPort } from '@/application/ports/validation-api.port';
import { IProductLookupPort } from '@/application/ports/product-lookup.port';
import { OnboardingRequestInProgressException } from '@/domain/exceptions/onboarding-request-in-progress.exception';
import { OnboardingProductNotFoundException } from '@/domain/exceptions/product-not-found.exception';
import { OnboardingStatus } from '@/domain/value-objects/onboarding-status.vo';

const createOnboardingRepositoryMock = (): jest.Mocked<IOnboardingRepository> =>
  ({
    save: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    findActiveByUserAndProduct: jest.fn(),
  }) as jest.Mocked<IOnboardingRepository>;

const createValidationApiMock = (): jest.Mocked<IValidationApiPort> =>
  ({
    requestValidation: jest.fn(),
  }) as jest.Mocked<IValidationApiPort>;

const createProductLookupMock = (): jest.Mocked<IProductLookupPort> => ({
  exists: jest.fn(),
});

describe('CreateOnboardingUseCase (updated - no user existence check)', () => {
  let useCase: CreateOnboardingUseCase;
  let onboardingRepository: jest.Mocked<IOnboardingRepository>;
  let validationApi: jest.Mocked<IValidationApiPort>;
  let productLookup: jest.Mocked<IProductLookupPort>;
  let logSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  beforeEach(async () => {
    jest.clearAllMocks();
    logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
    errorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();

    onboardingRepository = createOnboardingRepositoryMock();
    validationApi = createValidationApiMock();
    productLookup = createProductLookupMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOnboardingUseCase,
        { provide: IOnboardingRepository, useValue: onboardingRepository },
        { provide: IValidationApiPort, useValue: validationApi },
        { provide: IProductLookupPort, useValue: productLookup },
      ],
    }).compile();

    useCase = module.get(CreateOnboardingUseCase);
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  const baseDto = () => ({
    name: 'Test User',
    documentNumber: '123456789',
    email: 'user@test.com',
    initialAmount: 150,
    productId: 'product-uuid',
    createdByUserId: 'user-uuid',
  });

  it('creates, persists and requests validation', async () => {
    const dto = baseDto();
    productLookup.exists.mockResolvedValue(true);
    onboardingRepository.findActiveByUserAndProduct.mockResolvedValue(null);
    validationApi.requestValidation.mockResolvedValue(undefined);

    const result = await useCase.execute(dto);

    expect(onboardingRepository.save).toHaveBeenCalledTimes(1);
    expect(validationApi.requestValidation).toHaveBeenCalledTimes(1);
    expect(result.status).toBe(OnboardingStatus.REQUESTED);
  });

  it('logs error but succeeds when validation API fails', async () => {
    const dto = baseDto();
    productLookup.exists.mockResolvedValue(true);
    onboardingRepository.findActiveByUserAndProduct.mockResolvedValue(null);
    validationApi.requestValidation.mockRejectedValue(new Error('down'));

    const result = await useCase.execute(dto);
    expect(result.status).toBe(OnboardingStatus.REQUESTED);
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Failed to request validation'),
    );
  });

  it('throws OnboardingRequestInProgressException on duplicate active', async () => {
    const dto = baseDto();
    productLookup.exists.mockResolvedValue(true);
    onboardingRepository.findActiveByUserAndProduct.mockResolvedValue(
      {} as any,
    );

    await expect(useCase.execute(dto)).rejects.toThrow(
      OnboardingRequestInProgressException,
    );
  });

  it('throws OnboardingProductNotFoundException when product does not exist', async () => {
    const dto = baseDto();
    productLookup.exists.mockResolvedValue(false);
    onboardingRepository.findActiveByUserAndProduct.mockResolvedValue(null);

    await expect(useCase.execute(dto)).rejects.toThrow(
      OnboardingProductNotFoundException,
    );
  });
});
