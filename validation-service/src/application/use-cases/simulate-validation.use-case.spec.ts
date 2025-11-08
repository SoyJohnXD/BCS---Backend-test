import { Test, TestingModule } from '@nestjs/testing';
import { SimulateValidationUseCase } from '@/application/use-cases/simulate-validation.use-case';
import { IOnboardingApiPort } from '@/application/ports/onboarding-api.port';
import { ValidateOnboardingDto } from '@/application/dto/validate-onboarding.dto';
import { OnboardingStatus } from '@/domain/models/onboarding-status.enum';

const mockOnboardingApiPort = {
  notifyStatus: jest.fn(),
};

describe('SimulateValidationUseCase', () => {
  let useCase: SimulateValidationUseCase;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SimulateValidationUseCase,
        {
          provide: IOnboardingApiPort,
          useValue: mockOnboardingApiPort,
        },
      ],
    }).compile();

    useCase = module.get<SimulateValidationUseCase>(SimulateValidationUseCase);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should call notifyStatus with a result after 10s', async () => {
    const dto: ValidateOnboardingDto = { onboardingId: 'test-uuid-123' };
    mockOnboardingApiPort.notifyStatus.mockResolvedValue(undefined);

    const promise = useCase.execute(dto);

    expect(mockOnboardingApiPort.notifyStatus).not.toHaveBeenCalled();

    jest.advanceTimersByTime(10000);

    await Promise.resolve();

    expect(mockOnboardingApiPort.notifyStatus).toHaveBeenCalledTimes(1);

    const [calledId, calledStatus] =
      mockOnboardingApiPort.notifyStatus.mock.calls[0];

    expect(calledId).toBe('test-uuid-123');
    expect([OnboardingStatus.APPROVED, OnboardingStatus.REJECTED]).toContain(
      calledStatus,
    );
  });
});
