import { Inject, Injectable, Logger } from '@nestjs/common';
import { IOnboardingApiPort } from '@/application/ports/onboarding-api.port';
import { ValidateOnboardingDto } from '@/application/dto/validate-onboarding.dto';
import { OnboardingStatus } from '@/domain/models/onboarding-status.enum';

@Injectable()
export class SimulateValidationUseCase {
  private readonly logger = new Logger(SimulateValidationUseCase.name);
  private readonly SIMULATION_TIME_MS = 10000;
  private readonly APPROVAL_CHANCE = 0.8;

  constructor(
    @Inject(IOnboardingApiPort)
    private readonly onboardingApi: IOnboardingApiPort,
  ) {}

  async execute(dto: ValidateOnboardingDto): Promise<void> {
    this.logger.log(
      `Starting validation for: ${dto.onboardingId}... (Will take 10s)`,
    );

    await this.delay(this.SIMULATION_TIME_MS);

    const finalStatus =
      Math.random() < this.APPROVAL_CHANCE
        ? OnboardingStatus.APPROVED
        : OnboardingStatus.REJECTED;

    this.logger.log(
      `Validation complete for: ${dto.onboardingId}. Result: ${finalStatus}`,
    );

    try {
      await this.onboardingApi.notifyStatus(dto.onboardingId, finalStatus);
      this.logger.log(`Notification sent for: ${dto.onboardingId}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Failed to notify onboarding-service for: ${dto.onboardingId}`,
        message,
      );
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
