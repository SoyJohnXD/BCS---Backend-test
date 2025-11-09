import { Inject, Injectable, Logger } from '@nestjs/common';
import { IOnboardingRepository } from '@/domain/repositories/onboarding.repository';
import { OnboardingRequest } from '@/domain/entities/onboarding-request.entity';
import {
  CreateOnboardingUseCaseDto,
  CreateOnboardingUseCaseResultDto,
} from '../dto/create-onboarding.dto';
import { IValidationApiPort } from '../ports/validation-api.port';
import { IProductLookupPort } from '@/application/ports/product-lookup.port';
import { OnboardingRequestInProgressException } from '@/domain/exceptions/onboarding-request-in-progress.exception';
import { OnboardingProductNotFoundException } from '@/domain/exceptions/product-not-found.exception';

@Injectable()
export class CreateOnboardingUseCase {
  private readonly logger = new Logger(CreateOnboardingUseCase.name);

  constructor(
    @Inject(IOnboardingRepository)
    private readonly onboardingRepository: IOnboardingRepository,

    @Inject(IValidationApiPort)
    private readonly validationApi: IValidationApiPort,

    @Inject(IProductLookupPort)
    private readonly productLookup: IProductLookupPort,
  ) {}

  async execute(
    dto: CreateOnboardingUseCaseDto,
  ): Promise<CreateOnboardingUseCaseResultDto> {
    const productExists = await this.productLookup.exists(dto.productId);
    if (!productExists) {
      throw new OnboardingProductNotFoundException(dto.productId);
    }

    const active = await this.onboardingRepository.findActiveByUserAndProduct(
      dto.createdByUserId,
      dto.productId,
    );
    if (active) {
      throw new OnboardingRequestInProgressException(
        dto.createdByUserId,
        dto.productId,
      );
    }
    const newRequest = OnboardingRequest.create({
      name: dto.name,
      documentNumber: dto.documentNumber,
      email: dto.email,
      initialAmount: dto.initialAmount,
      productId: dto.productId,
      createdByUserId: dto.createdByUserId,
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
