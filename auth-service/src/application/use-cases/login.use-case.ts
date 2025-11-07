import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '@/domain/repositories/user.repository';
import { IPasswordHasher } from '@/application/ports/password-hasher.port';
import { ITokenService } from '@/application/ports/token.port';
import { LoginUseCaseDto } from '@/application/dto/login-use-case.dto';
import { LoginUseCaseResultDto } from '@/application/dto/login-use-case-result.dto';
import { InvalidCredentialsException } from '@/domain/exceptions/invalid-credentials.exception';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,

    @Inject(IPasswordHasher)
    private readonly passwordHasher: IPasswordHasher,

    @Inject(ITokenService)
    private readonly tokenService: ITokenService,
  ) {}

  /**
   * Ejecuta el caso de uso de inicio de sesión.
   * @param dto Los datos de email y contraseña.
   * @returns Una promesa que resuelve al DTO con el token.
   * @throws {InvalidCredentialsException} Si el email o la contraseña son incorrectos.
   */
  async execute(dto: LoginUseCaseDto): Promise<LoginUseCaseResultDto> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new InvalidCredentialsException();
    }

    const isPasswordValid = await this.passwordHasher.compare(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    const token = await this.tokenService.sign({
      sub: user.id,
      email: user.email,
    });

    return { token };
  }
}
