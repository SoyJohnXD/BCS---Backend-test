import { Test, TestingModule } from '@nestjs/testing';
import { InternalController } from './internal.controller';
import { UpdateOnboardingStatusUseCase } from '@/application/use-cases/update-onboarding-status.use-case';
import { UpdateStatusRequestDto } from '@/presentation/dto/update-status-request.dto';
import { OnboardingStatus } from '@/domain/value-objects/onboarding-status.vo';

const mockUpdateOnboardingStatusUseCase = {
  execute: jest.fn(),
};

describe('InternalController', () => {
  let controller: InternalController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InternalController],
      providers: [
        {
          provide: UpdateOnboardingStatusUseCase,
          useValue: mockUpdateOnboardingStatusUseCase,
        },
      ],
    }).compile();

    controller = module.get<InternalController>(InternalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call UpdateOnboardingStatusUseCase with correct parameters', async () => {
    const paramId = 'onboarding-uuid-123';
    const bodyDto: UpdateStatusRequestDto = {
      status: OnboardingStatus.APPROVED,
    };

    mockUpdateOnboardingStatusUseCase.execute.mockResolvedValue(undefined);

    await controller.updateOnboardingStatus(paramId, bodyDto);

    expect(mockUpdateOnboardingStatusUseCase.execute.mock.calls.length).toBe(1);
    expect(mockUpdateOnboardingStatusUseCase.execute.mock.calls[0]).toEqual([
      {
        id: paramId,
        status: bodyDto.status,
      },
    ]);
  });

  it('should propagate exceptions from the use case', async () => {
    const paramId = 'onboarding-uuid-456';
    const bodyDto: UpdateStatusRequestDto = {
      status: OnboardingStatus.REJECTED,
    };

    const error = new Error('Request not found');
    mockUpdateOnboardingStatusUseCase.execute.mockRejectedValue(error);

    await expect(
      controller.updateOnboardingStatus(paramId, bodyDto),
    ).rejects.toThrow('Request not found');
  });
});
