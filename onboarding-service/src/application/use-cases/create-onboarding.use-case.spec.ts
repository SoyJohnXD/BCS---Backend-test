import { Test, TestingModule } from '@nestjs/testing';
import { CreateOnboardingUseCase } from './create-onboarding.use-case';
import { IOnboardingRepository } from '@/domain/repositories/onboarding.repository';
import { OnboardingStatus } from '@/domain/value-objects/onboarding-status.vo';

const mockOnboardingRepository = {
  save: jest.fn(),
  findById: jest.fn(),
};

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
      ],
    }).compile();

    useCase = module.get<CreateOnboardingUseCase>(CreateOnboardingUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should create an onboarding request and save it', async () => {
    const dto = {
      nombre: 'Cliente Prueba',
      documento: '123456789',
      email: 'cliente@prueba.com',
      montoInicial: 100,
    };

    mockOnboardingRepository.save.mockResolvedValue(undefined);

    const result = await useCase.execute(dto);

    expect(mockOnboardingRepository.save).toHaveBeenCalledTimes(1);

    const savedRequest = mockOnboardingRepository.save.mock.calls[0][0];
    expect(savedRequest.nombre).toBe(dto.nombre);
    expect(savedRequest.documento).toBe(dto.documento);
    expect(savedRequest.email).toBe(dto.email);
    expect(savedRequest.montoInicial).toBe(dto.montoInicial);

    expect(savedRequest.status).toBe(OnboardingStatus.REQUESTED);

    expect(savedRequest.id).toBeDefined();

    expect(result).toEqual({
      onboardingId: savedRequest.id,
      status: OnboardingStatus.REQUESTED,
    });
  });
});
