import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateOnboardingUseCase } from './create-onboarding.use-case';
import { IOnboardingRepository } from '@/domain/repositories/onboarding.repository';
import { IValidationApiPort } from '@/application/ports/validation-api.port';
import { OnboardingStatus } from '@/domain/value-objects/onboarding-status.vo';

const createOnboardingRepositoryMock =
  (): jest.Mocked<IOnboardingRepository> => {
    return {
      save: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
    } as jest.Mocked<IOnboardingRepository>;
  };

const createValidationApiMock = (): jest.Mocked<IValidationApiPort> => {
  return {
    requestValidation: jest.fn(),
  } as jest.Mocked<IValidationApiPort>;
};

describe('CreateOnboardingUseCase', () => {
  let useCase: CreateOnboardingUseCase;
  let onboardingRepositoryMock: jest.Mocked<IOnboardingRepository>;
  let validationApiMock: jest.Mocked<IValidationApiPort>;
  let loggerErrorSpy: jest.SpyInstance;
  let loggerLogSpy: jest.SpyInstance;

  beforeEach(async () => {
    jest.clearAllMocks();

    loggerErrorSpy = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => undefined);
    loggerLogSpy = jest
      .spyOn(Logger.prototype, 'log')
      .mockImplementation(() => undefined);

    onboardingRepositoryMock = createOnboardingRepositoryMock();
    validationApiMock = createValidationApiMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOnboardingUseCase,
        {
          provide: IOnboardingRepository,
          useValue: onboardingRepositoryMock,
        },
        {
          provide: IValidationApiPort,
          useValue: validationApiMock,
        },
      ],
    }).compile();

    useCase = module.get<CreateOnboardingUseCase>(CreateOnboardingUseCase);
  });

  afterEach(() => {
    loggerErrorSpy.mockRestore();
    loggerLogSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should create, save, and request validation', async () => {
    const dto = {
      name: 'Test Client',
      documentNumber: '123456789',
      email: 'client@test.com',
      initialAmount: 100,
    };

    onboardingRepositoryMock.save.mockResolvedValue(undefined);
    validationApiMock.requestValidation.mockResolvedValue(undefined);

    const result = await useCase.execute(dto);

    expect(onboardingRepositoryMock.save.mock.calls).toHaveLength(1);
    const savedRequest = onboardingRepositoryMock.save.mock.calls[0]?.[0];
    if (!savedRequest) {
      throw new Error('Expected onboarding request to be persisted');
    }
    expect(savedRequest.name).toBe(dto.name);
    expect(result.status).toBe(OnboardingStatus.REQUESTED);
    expect(validationApiMock.requestValidation.mock.calls).toHaveLength(1);
    expect(validationApiMock.requestValidation.mock.calls[0]).toEqual([
      savedRequest.id,
    ]);
    expect(loggerLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('Requesting validation for'),
    );
  });

  it('should still succeed if validation request fails (fire-and-forget)', async () => {
    const dto = {
      name: 'Client Without Validation',
      documentNumber: '987654321',
      email: 'fail@test.com',
      initialAmount: 50,
    };

    onboardingRepositoryMock.save.mockResolvedValue(undefined);
    const validationError = new Error('Validation service down');
    validationApiMock.requestValidation.mockRejectedValue(validationError);

    const result = await useCase.execute(dto);

    await new Promise((resolve) => setImmediate(resolve));

    expect(onboardingRepositoryMock.save.mock.calls).toHaveLength(1);
    const savedRequest = onboardingRepositoryMock.save.mock.calls[0]?.[0];
    if (!savedRequest) {
      throw new Error('Expected onboarding request to be persisted');
    }
    expect(result.onboardingId).toBe(savedRequest.id);
    expect(validationApiMock.requestValidation.mock.calls).toHaveLength(1);
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Failed to request validation'),
    );
  });
});
