import { Test, TestingModule } from '@nestjs/testing';
import { OnboardingController } from './onboarding.controller';
import { CreateOnboardingUseCase } from '@/application/use-cases/create-onboarding.use-case';
import { OnboardingRequestDto } from '@/presentation/dto/onboarding-request.dto';
import { OnboardingStatus } from '@/domain/value-objects/onboarding-status.vo';

// --- Mocks ---
const mockCreateOnboardingUseCase = {
  execute: jest.fn(),
};
// --- Fin Mocks ---

describe('OnboardingController', () => {
  let controller: OnboardingController;
  let useCase: CreateOnboardingUseCase;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OnboardingController],
      providers: [
        {
          provide: CreateOnboardingUseCase,
          useValue: mockCreateOnboardingUseCase,
        },
      ],
    }).compile();

    controller = module.get<OnboardingController>(OnboardingController);
    useCase = module.get<CreateOnboardingUseCase>(CreateOnboardingUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call CreateOnboardingUseCase and return the result', async () => {
    // 1. Arrange
    const requestDto: OnboardingRequestDto = {
      name: 'Test User',
      documentNumber: '12345',
      email: 'test@user.com',
      initialAmount: 100,
    };

    const useCaseResult = {
      onboardingId: 'new-uuid-123',
      status: OnboardingStatus.REQUESTED,
    };

    mockCreateOnboardingUseCase.execute.mockResolvedValue(useCaseResult);

    // 2. Act
    // --- CORRECCIÓN ---
    // Cambiamos controller.createOnboarding por controller.create
    const result = await controller.create(requestDto);
    // --- FIN CORRECCIÓN ---

    // 3. Assert
    expect(useCase.execute).toHaveBeenCalledTimes(1);
    expect(useCase.execute).toHaveBeenCalledWith({
      name: 'Test User',
      documentNumber: '12345',
      email: 'test@user.com',
      initialAmount: 100,
    });
    expect(result).toEqual(useCaseResult);
  });

  it('should propagate exceptions from the use case', async () => {
    // 1. Arrange
    const requestDto: OnboardingRequestDto = {
      name: 'Test User',
      documentNumber: '12345',
      email: 'test@user.com',
      initialAmount: 100,
    };

    const error = new Error('Database error');
    mockCreateOnboardingUseCase.execute.mockRejectedValue(error);

    // 2. Act & 3. Assert
    // --- CORRECCIÓN ---
    // Cambiamos controller.createOnboarding por controller.create
    await expect(controller.create(requestDto)).rejects.toThrow(
      'Database error',
    );
    // --- FIN CORRECCIÓN ---
  });
});
