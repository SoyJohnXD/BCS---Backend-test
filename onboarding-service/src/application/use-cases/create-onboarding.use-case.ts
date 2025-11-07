import { Inject, Injectable } from '@nestjs/common';
import { IOnboardingRepository } from '@/domain/repositories/onboarding.repository';
import { OnboardingRequest } from '@/domain/entities/onboarding-request.entity';
import {
  CreateOnboardingUseCaseDto,
  CreateOnboardingUseCaseResultDto,
} from '../dto/create-onboarding.dto';

@Injectable()
export class CreateOnboardingUseCase {
  constructor(
    @Inject(IOnboardingRepository)
    private readonly onboardingRepository: IOnboardingRepository,
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

    return {
      onboardingId: newRequest.id,
      status: newRequest.status,
    };
  }
}
