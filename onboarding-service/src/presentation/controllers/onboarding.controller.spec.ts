import { Test, TestingModule } from '@nestjs/testing';
import { OnboardingController } from './onboarding.controller';
import { CreateOnboardingUseCase } from '@/application/use-cases/create-onboarding.use-case';
import { OnboardingRequestDto } from '@/presentation/dto/onboarding-request.dto';
import { OnboardingStatus } from '@/domain/value-objects/onboarding-status.vo';

const mockCreateOnboardingUseCase = {
  execute: jest.fn(),
};

describe('OnboardingController', () => {
  let controller: OnboardingController;

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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call CreateOnboardingUseCase and return the result', async () => {
    const requestDto: OnboardingRequestDto = {
      name: 'Test User',
      documentNumber: '12345',
      email: 'test@user.com',
      initialAmount: 100,
      productId: 'product-uuid',
    };

    const useCaseResult = {
      onboardingId: 'new-uuid-123',
      status: OnboardingStatus.REQUESTED,
    };

    mockCreateOnboardingUseCase.execute.mockResolvedValue(useCaseResult);

    const result = await controller.create(requestDto, 'user-uuid');

    expect(mockCreateOnboardingUseCase.execute.mock.calls.length).toBe(1);
    expect(mockCreateOnboardingUseCase.execute.mock.calls[0]).toEqual([
      {
        name: 'Test User',
        documentNumber: '12345',
        email: 'test@user.com',
        initialAmount: 100,
        productId: 'product-uuid',
        createdByUserId: 'user-uuid',
      },
    ]);
    expect(result).toEqual(useCaseResult);
  });

  it('should propagate exceptions from the use case', async () => {
    const requestDto: OnboardingRequestDto = {
      name: 'Test User',
      documentNumber: '12345',
      email: 'test@user.com',
      initialAmount: 100,
      productId: 'product-uuid',
    };

    const error = new Error('Database error');
    mockCreateOnboardingUseCase.execute.mockRejectedValue(error);

    await expect(controller.create(requestDto, 'user-uuid')).rejects.toThrow(
      'Database error',
    );
  });
});
