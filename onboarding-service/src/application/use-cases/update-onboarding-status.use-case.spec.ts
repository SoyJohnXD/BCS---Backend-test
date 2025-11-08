import { Test, TestingModule } from '@nestjs/testing';
import { UpdateOnboardingStatusUseCase } from './update-onboarding-status.use-case';
import { IOnboardingRepository } from '@/domain/repositories/onboarding.repository';
import { INotificationPort } from '@/application/ports/notification.port';
import { OnboardingRequest } from '@/domain/entities/onboarding-request.entity';
import { OnboardingStatus } from '@/domain/value-objects/onboarding-status.vo';
import { OnboardingRequestNotFoundException } from '@/domain/exceptions/onboarding-request-not-found.exception';
import { OnboardingRequestFinalizedException } from '@/domain/exceptions/onboarding-request-finalized.exception';
import { UpdateOnboardingStatusDto } from '../dto/update-onboarding-status.dto';

const mockOnboardingRepository = {
  findById: jest.fn(),
  update: jest.fn(),
};

const mockNotificationPort = {
  sendOnboardingResult: jest.fn(),
};

const mockOnboardingRequest = {
  id: 'test-id',
  email: 'test@email.com',
  name: 'Test User',
  updateStatus: jest.fn(),
};

describe('UpdateOnboardingStatusUseCase', () => {
  let useCase: UpdateOnboardingStatusUseCase;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateOnboardingStatusUseCase,
        {
          provide: IOnboardingRepository,
          useValue: mockOnboardingRepository,
        },
        {
          provide: INotificationPort,
          useValue: mockNotificationPort,
        },
      ],
    }).compile();

    useCase = module.get<UpdateOnboardingStatusUseCase>(
      UpdateOnboardingStatusUseCase,
    );

    mockOnboardingRepository.findById.mockResolvedValue(
      mockOnboardingRequest as unknown as OnboardingRequest,
    );
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should update status, save, and notify (happy path)', async () => {
    const dto: UpdateOnboardingStatusDto = {
      id: 'test-id',
      status: OnboardingStatus.APPROVED,
    };
    mockOnboardingRepository.update.mockResolvedValue(undefined);
    mockNotificationPort.sendOnboardingResult.mockResolvedValue(undefined);

    await useCase.execute(dto);

    expect(mockOnboardingRepository.findById).toHaveBeenCalledWith('test-id');

    expect(mockOnboardingRequest.updateStatus).toHaveBeenCalledWith(
      OnboardingStatus.APPROVED,
    );

    expect(mockOnboardingRepository.update).toHaveBeenCalledWith(
      mockOnboardingRequest,
    );

    expect(mockNotificationPort.sendOnboardingResult).toHaveBeenCalledWith(
      'test@email.com',
      'Test User',
      OnboardingStatus.APPROVED,
    );
  });

  it('should throw OnboardingRequestNotFoundException if request is not found', async () => {
    mockOnboardingRepository.findById.mockResolvedValue(null);

    const dto: UpdateOnboardingStatusDto = {
      id: 'not-found-id',
      status: OnboardingStatus.APPROVED,
    };

    await expect(useCase.execute(dto)).rejects.toThrow(
      OnboardingRequestNotFoundException,
    );
    await expect(useCase.execute(dto)).rejects.toThrow(
      'Onboarding request with ID "not-found-id" not found.',
    );

    expect(mockOnboardingRepository.update).not.toHaveBeenCalled();
    expect(mockNotificationPort.sendOnboardingResult).not.toHaveBeenCalled();
  });

  it('should throw if entity domain logic throws (e.g., already finalized)', async () => {
    const domainError = new OnboardingRequestFinalizedException(
      'test-id',
      OnboardingStatus.REJECTED,
    );
    mockOnboardingRequest.updateStatus.mockImplementation(() => {
      throw domainError;
    });

    const dto: UpdateOnboardingStatusDto = {
      id: 'test-id',
      status: OnboardingStatus.APPROVED,
    };

    await expect(useCase.execute(dto)).rejects.toThrow(
      OnboardingRequestFinalizedException,
    );

    expect(mockOnboardingRepository.findById).toHaveBeenCalledWith('test-id');
    expect(mockOnboardingRequest.updateStatus).toHaveBeenCalledWith(
      OnboardingStatus.APPROVED,
    );

    expect(mockOnboardingRepository.update).not.toHaveBeenCalled();
    expect(mockNotificationPort.sendOnboardingResult).not.toHaveBeenCalled();
  });

  it('should not throw if notification fails (graceful handling)', async () => {
    const notificationError = new Error('SMTP Error');
    mockNotificationPort.sendOnboardingResult.mockRejectedValue(
      notificationError,
    );
    mockOnboardingRequest.updateStatus.mockImplementation(() => {});

    const dto: UpdateOnboardingStatusDto = {
      id: 'test-id',
      status: OnboardingStatus.REJECTED,
    };

    await expect(useCase.execute(dto)).resolves.not.toThrow();

    expect(mockOnboardingRepository.findById).toHaveBeenCalledWith('test-id');
    expect(mockOnboardingRequest.updateStatus).toHaveBeenCalledWith(
      OnboardingStatus.REJECTED,
    );
    expect(mockOnboardingRepository.update).toHaveBeenCalledWith(
      mockOnboardingRequest,
    );

    expect(mockNotificationPort.sendOnboardingResult).toHaveBeenCalled();
  });
});
