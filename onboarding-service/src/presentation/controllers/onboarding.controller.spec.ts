import { Test, TestingModule } from '@nestjs/testing';
import { OnboardingController } from './onboarding.controller';
import { CreateOnboardingUseCase } from '@/application/use-cases/create-onboarding.use-case';
import { OnboardingRequestDto } from '../dto/onboarding-request.dto';
import { OnboardingStatus } from '@/domain/value-objects/onboarding-status.vo';

const mockCreateOnboardingUseCase = {
  execute: jest.fn(),
};

describe('OnboardingController', () => {
  let controller: OnboardingController;
  let useCase: CreateOnboardingUseCase;

  beforeEach(async () => {
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
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call the CreateOnboardingUseCase.execute with the correct dto', async () => {
      const requestDto: OnboardingRequestDto = {
        nombre: 'Cliente Prueba',
        documento: '123456',
        email: 'test@bank.com',
        montoInicial: 100,
      };
      const expectedResult = {
        onboardingId: 'a-valid-uuid',
        status: OnboardingStatus.REQUESTED,
      };
      mockCreateOnboardingUseCase.execute.mockResolvedValue(expectedResult);

      const result = await controller.create(requestDto);

      expect(useCase.execute).toHaveBeenCalledWith(requestDto);
      expect(result).toBe(expectedResult);
    });
  });
});
