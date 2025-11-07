import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { CreateOnboardingUseCase } from '@/application/use-cases/create-onboarding.use-case';
import { OnboardingRequestDto } from '../dto/onboarding-request.dto';
import { CreateOnboardingUseCaseResultDto } from '@/application/dto/create-onboarding.dto';

@Controller('onboarding')
export class OnboardingController {
  constructor(
    private readonly createOnboardingUseCase: CreateOnboardingUseCase,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(
    @Body() requestDto: OnboardingRequestDto,
  ): Promise<CreateOnboardingUseCaseResultDto> {
    return this.createOnboardingUseCase.execute(requestDto);
  }
}
