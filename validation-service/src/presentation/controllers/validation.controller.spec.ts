import { Test, TestingModule } from '@nestjs/testing';
import { ValidationController } from '@/presentation/controllers/validation.controller';
import { SimulateValidationUseCase } from '@/application/use-cases/simulate-validation.use-case';
import { ValidationRequestDto } from '@/presentation/dto/validation-request.dto';

const mockSimulateValidationUseCase = {
  execute: jest.fn(),
};

describe('ValidationController', () => {
  let controller: ValidationController;
  let useCase: SimulateValidationUseCase;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ValidationController],
      providers: [
        {
          provide: SimulateValidationUseCase,
          useValue: mockSimulateValidationUseCase,
        },
      ],
    }).compile();

    controller = module.get<ValidationController>(ValidationController);
    useCase = module.get<SimulateValidationUseCase>(SimulateValidationUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call use case (fire-and-forget) and return 202 message', () => {
    const dto: ValidationRequestDto = { onboardingId: 'test-id-123' };

    const result = controller.startValidation(dto);

    expect(useCase.execute).toHaveBeenCalledTimes(1);
    expect(useCase.execute).toHaveBeenCalledWith(dto);

    expect(result).toEqual({
      message: 'Validation request received and is being processed.',
    });
  });
});
