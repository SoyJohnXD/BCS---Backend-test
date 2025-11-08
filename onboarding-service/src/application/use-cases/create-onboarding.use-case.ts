import { Inject, Injectable, Logger } from '@nestjs/common';
import { IOnboardingRepository } from '@/domain/repositories/onboarding.repository';
import { OnboardingRequest } from '@/domain/entities/onboarding-request.entity';
import {
  CreateOnboardingUseCaseDto,
  CreateOnboardingUseCaseResultDto,
} from '../dto/create-onboarding.dto';
import { IValidationApiPort } from '../ports/validation-api.port'; // <-- 1. Importar

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
      nombre: dto.nombre,
      documento: dto.documento,
      email: dto.email,
      montoInicial: dto.montoInicial,
    });

    await this.onboardingRepository.save(newRequest);

    try {
      this.logger.log(`Solicitando validación para: ${newRequest.id}`);
      this.validationApi.requestValidation(newRequest.id);
    } catch (error) {
      this.logger.error(
        `Fallo al solicitar la validación para ${newRequest.id}: ${error.message}`,
      );
    }

    return {
      onboardingId: newRequest.id,
      status: newRequest.status,
    };
  }
}
