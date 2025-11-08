import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { LoginUseCase } from '@/application/use-cases/login.use-case';
import { LoginRequestDto } from '../dto/login-request.dto';

const mockLoginUseCase = {
  execute: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: LoginUseCase,
          useValue: mockLoginUseCase,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call the LoginUseCase.execute with the correct dto', async () => {
      const loginDto: LoginRequestDto = {
        email: 'test@bank.com',
        password: 'password123',
      };
      const expectedResult = { token: 'fake-jwt-token' };
      mockLoginUseCase.execute.mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto);

      expect(mockLoginUseCase.execute).toHaveBeenCalledWith(loginDto);
      expect(result).toBe(expectedResult);
    });
  });
});
