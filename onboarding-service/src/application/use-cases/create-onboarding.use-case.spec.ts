import { Test, TestingModule } from '@nestjs/testing';
import { CreateOnboardingUseCase } from './create-onboarding.use-case';
import { IOnboardingRepository } from '@/domain/repositories/onboarding.repository';
import { IValidationApiPort } from '@/application/ports/validation-api.port';
import { OnboardingStatus } from '@/domain/value-objects/onboarding-status.vo';

// --- Mocks ---
const mockOnboardingRepository = {
  save: jest.fn(),
};

const mockValidationApiPort = {
  requestValidation: jest.fn(),
};
// --- Fin Mocks ---

describe('CreateOnboardingUseCase', () => {
  let useCase: CreateOnboardingUseCase;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOnboardingUseCase,
        {
          provide: IOnboardingRepository,
          useValue: mockOnboardingRepository,
        },
        {
          provide: IValidationApiPort,
          useValue: mockValidationApiPort,
        },
      ],
    }).compile();

    useCase = module.get<CreateOnboardingUseCase>(CreateOnboardingUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should create, save, and request validation', async () => {
    // 1. Arrange
    const dto = {
      name: 'Test Client',
      documentNumber: '123456789',
      email: 'client@test.com',
      initialAmount: 100,
    };

    mockOnboardingRepository.save.mockResolvedValue(undefined);
    mockValidationApiPort.requestValidation.mockResolvedValue(undefined);

    // 2. Act
    const result = await useCase.execute(dto);

    // 3. Assert
    expect(mockOnboardingRepository.save).toHaveBeenCalledTimes(1);
    const savedRequest = mockOnboardingRepository.save.mock.calls[0][0];
    expect(savedRequest.name).toBe(dto.name);
    expect(result.status).toBe(OnboardingStatus.REQUESTED);
    expect(mockValidationApiPort.requestValidation).toHaveBeenCalledTimes(1);
    expect(mockValidationApiPort.requestValidation).toHaveBeenCalledWith(
      savedRequest.id,
    );
  });

  it('should still succeed if validation request fails (fire-and-forget)', async () => {
    // 1. Arrange
    const dto = {
      name: 'Client Without Validation',
      documentNumber: '987654321',
      email: 'fail@test.com',
      initialAmount: 50,
    };

    mockOnboardingRepository.save.mockResolvedValue(undefined);
    const validationError = new Error('Validation service down');
    mockValidationApiPort.requestValidation.mockRejectedValue(validationError);

    // 2. Act
    const result = await useCase.execute(dto);

    // --- CORRECCIÓN ---
    // Le damos al event loop la oportunidad de ejecutar el .catch()
    // del caso de uso antes de que termine la prueba.
    await new Promise((resolve) => setImmediate(resolve));
    // --- FIN CORRECCIÓN ---

    // 3. Assert
    expect(mockOnboardingRepository.save).toHaveBeenCalledTimes(1);
    const savedRequest = mockOnboardingRepository.save.mock.calls[0][0];
    expect(result.onboardingId).toBe(savedRequest.id);
    expect(mockValidationApiPort.requestValidation).toHaveBeenCalledTimes(1);
  });
});
