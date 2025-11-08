import { Inject, Injectable, Logger } from '@nestjs/common';
import { IOnboardingRepository } from '@/domain/repositories/onboarding.repository';
import { UpdateOnboardingStatusDto } from '@/application/dto/update-onboarding-status.dto';

import { INotificationPort } from '../ports/notification.port';
import { OnboardingRequestNotFoundException } from '@/domain/exceptions/onboarding-request-not-found.exception';

@Injectable()
export class UpdateOnboardingStatusUseCase {
  private readonly logger = new Logger(UpdateOnboardingStatusUseCase.name);

  constructor(
    @Inject(IOnboardingRepository)
    private readonly onboardingRepository: IOnboardingRepository,
    @Inject(INotificationPort)
    private readonly notificationPort: INotificationPort,
  ) {}

  async execute(dto: UpdateOnboardingStatusDto): Promise<void> {
    this.logger.log(`Attempting to update status for ID: ${dto.id}`);

    const onboardingRequest = await this.onboardingRepository.findById(dto.id);

    if (!onboardingRequest) {
      this.logger.warn(`Onboarding request not found: ${dto.id}`);
      throw new OnboardingRequestNotFoundException(dto.id);
    }

    onboardingRequest.updateStatus(dto.status);

    await this.onboardingRepository.update(onboardingRequest);

    this.logger.log(`Status updated to ${dto.status} for ID: ${dto.id}`);

    try {
      await this.notificationPort.sendOnboardingResult(
        onboardingRequest.email,
        onboardingRequest.name,
        dto.status,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Failed to send notification for ID: ${dto.id}. Error: ${message}`,
      );
    }
  }
}
