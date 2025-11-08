import { IsEnum } from 'class-validator';
import { OnboardingStatus } from '@/domain/value-objects/onboarding-status.vo';

export class UpdateStatusRequestDto {
  @IsEnum([OnboardingStatus.APPROVED, OnboardingStatus.REJECTED], {
    message: `Status must be ${OnboardingStatus.APPROVED} or ${OnboardingStatus.REJECTED}`,
  })
  status: OnboardingStatus.APPROVED | OnboardingStatus.REJECTED;
}
