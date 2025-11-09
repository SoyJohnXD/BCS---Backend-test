import { Inject, Injectable, Logger } from '@nestjs/common';
import { IUserRepository } from '@/domain/repositories/user.repository';
import { IPasswordHasher } from '@/application/ports/password-hasher.port';
import { ITokenService } from '@/application/ports/token.port';
import { LoginUseCaseDto } from '@/application/dto/login-use-case.dto';
import { LoginUseCaseResultDto } from '@/application/dto/login-use-case-result.dto';
import { InvalidCredentialsException } from '@/domain/exceptions/invalid-credentials.exception';

@Injectable()
export class LoginUseCase {
  private readonly logger = new Logger(LoginUseCase.name);

  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,

    @Inject(IPasswordHasher)
    private readonly passwordHasher: IPasswordHasher,

    @Inject(ITokenService)
    private readonly tokenService: ITokenService,
  ) {}

  async execute(dto: LoginUseCaseDto): Promise<LoginUseCaseResultDto> {
  
    this.logger.log(`Iniciando login para ${dto.email}`);

    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      this.logger.warn(`Usuario no encontrado: ${dto.email}`);
      throw new InvalidCredentialsException();
    }

    this.logger.log(`Usuario encontrado: ${user.id}. Comparando contraseña...`);

    const isPasswordValid = await this.passwordHasher.compare(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      this.logger.warn(`Contraseña inválida para ${user.id}`);
      throw new InvalidCredentialsException();
    }

    this.logger.log(`Contraseña válida. Generando token...`);

    const token = await this.tokenService.sign({
      sub: user.id,
      email: user.email,
    });

    this.logger.log(`Login exitoso para ${user.id}.`);
    return { token };
  }
}