import { Test, TestingModule } from '@nestjs/testing';
import { LoginUseCase } from './login.use-case';
import { IUserRepository } from '@/domain/repositories/user.repository';
import { IPasswordHasher } from '@/application/ports/password-hasher.port';
import { ITokenService } from '@/application/ports/token.port';
import { User } from '@/domain/entities/user.entity';
import { InvalidCredentialsException } from '@/domain/exceptions/invalid-credentials.exception';

const mockUserRepository = {
  findByEmail: jest.fn(),
  save: jest.fn(),
};

const mockPasswordHasher = {
  hash: jest.fn(),
  compare: jest.fn(),
};

const mockTokenService = {
  sign: jest.fn(),
};

const mockUser = User.fromPrimitives({
  id: 'a-valid-uuid',
  email: 'test@bank.com',
  passwordHash: 'hashed-password',
  createdAt: new Date(),
});

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        { provide: IUserRepository, useValue: mockUserRepository },
        { provide: IPasswordHasher, useValue: mockPasswordHasher },
        { provide: ITokenService, useValue: mockTokenService },
      ],
    }).compile();

    useCase = module.get<LoginUseCase>(LoginUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return a token on successful login', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    mockPasswordHasher.compare.mockResolvedValue(true);
    mockTokenService.sign.mockResolvedValue('fake-jwt-token');

    const dto = { email: 'test@bank.com', password: 'password123' };

    const result = await useCase.execute(dto);

    expect(result.token).toBe('fake-jwt-token');
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(dto.email);
    expect(mockPasswordHasher.compare).toHaveBeenCalledWith(
      dto.password,
      mockUser.passwordHash,
    );
    expect(mockTokenService.sign).toHaveBeenCalledWith({
      sub: mockUser.id,
      email: mockUser.email,
    });
  });

  it('should throw InvalidCredentialsException if user not found', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);
    const dto = { email: 'not-found@bank.com', password: 'password123' };

    await expect(useCase.execute(dto)).rejects.toThrow(
      InvalidCredentialsException,
    );

    expect(mockPasswordHasher.compare).not.toHaveBeenCalled();
    expect(mockTokenService.sign).not.toHaveBeenCalled();
  });

  it('should throw InvalidCredentialsException if password does not match', async () => {
    mockPasswordHasher.compare.mockResolvedValue(false);
    const dto = { email: 'test@bank.com', password: 'wrong-password' };

    await expect(useCase.execute(dto)).rejects.toThrow(
      InvalidCredentialsException,
    );

    expect(mockTokenService.sign).not.toHaveBeenCalled();
  });
});
