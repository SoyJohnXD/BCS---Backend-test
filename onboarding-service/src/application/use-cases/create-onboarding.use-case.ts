import { Inject, Injectable, Logger } from '@nestjs/common';
import { IOnboardingRepository } from '@/domain/repositories/onboarding.repository';
import { OnboardingRequest } from '@/domain/entities/onboarding-request.entity';
import {
  CreateOnboardingUseCaseDto,
  CreateOnboardingUseCaseResultDto,
} from '../dto/create-onboarding.dto';
import { IValidationApiPort } from '../ports/validation-api.port';

@Injectable()
export class CreateOnboardingUseCase {
  private readonly logger = new Logger(CreateOnboardingUseCase.name);

  constructor(
    @Inject(IOnboardingRepository)
    private readonly onboardingRepository: IOnboardingRepository,

    @Inject(IValidationApiPort)
    private readonly validationApi: IValidationApiPort,
  ) {}

  async execute(
    dto: CreateOnboardingUseCaseDto,
  ): Promise<CreateOnboardingUseCaseResultDto> {
    const newRequest = OnboardingRequest.create({
      name: dto.name,
      documentNumber: dto.documentNumber,
      email: dto.email,
      initialAmount: dto.initialAmount,
    });

    await this.onboardingRepository.save(newRequest);

    try {
      this.logger.log(`Requesting validation for: ${newRequest.id}`);
      await this.validationApi.requestValidation(newRequest.id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Failed to request validation for ${newRequest.id}: ${message}`,
      );
    }

    return {
      onboardingId: newRequest.id,
      status: newRequest.status,
    };
  }
}
