import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { LoginUseCase } from '@/application/use-cases/login.use-case';
import { LoginRequestDto } from '@/presentation/dto/login-request.dto';
import { LoginUseCaseResultDto } from '@/application/dto/login-use-case-result.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async login(
    @Body() loginRequest: LoginRequestDto,
  ): Promise<LoginUseCaseResultDto> {
    return this.loginUseCase.execute(loginRequest);
  }
}
