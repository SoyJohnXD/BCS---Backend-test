import { Test, TestingModule } from '@nestjs/testing';
import { SimulateValidationUseCase } from '@/application/use-cases/simulate-validation.use-case';
import { IOnboardingApiPort } from '@/application/ports/onboarding-api.port';
import { ValidateOnboardingDto } from '@/application/dto/validate-onboarding.dto';
import { OnboardingStatus } from '@/domain/models/onboarding-status.enum';

const createOnboardingApiPortMock = (): jest.Mocked<IOnboardingApiPort> => {
  return {
    notifyStatus: jest.fn(),
  } as jest.Mocked<IOnboardingApiPort>;
};

describe('SimulateValidationUseCase', () => {
  let useCase: SimulateValidationUseCase;
  let onboardingApiMock: jest.Mocked<IOnboardingApiPort>;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    onboardingApiMock = createOnboardingApiPortMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SimulateValidationUseCase,
        {
          provide: IOnboardingApiPort,
          useValue: onboardingApiMock,
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
    onboardingApiMock.notifyStatus.mockResolvedValue(undefined);

    const executionPromise = useCase.execute(dto);

    expect(onboardingApiMock.notifyStatus.mock.calls).toHaveLength(0);

    jest.advanceTimersByTime(10000);

    await executionPromise;

    expect(onboardingApiMock.notifyStatus.mock.calls).toHaveLength(1);

    const notifications = onboardingApiMock.notifyStatus.mock.calls as Array<
      [string, string]
    >;
    const [calledId, calledStatus] = notifications[0];

    expect(calledId).toBe('test-uuid-123');
    expect([OnboardingStatus.APPROVED, OnboardingStatus.REJECTED]).toContain(
      calledStatus,
    );
  });
});
