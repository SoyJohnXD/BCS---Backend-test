import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  Headers,
  BadRequestException,
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
    @Headers('x-user-id') userId?: string,
  ): Promise<CreateOnboardingUseCaseResultDto> {
    if (!userId) {
      throw new BadRequestException('Missing x-user-id header');
    }
    const createdByUserId = userId;
    return this.createOnboardingUseCase.execute({
      ...requestDto,
      createdByUserId,
    });
  }
}
