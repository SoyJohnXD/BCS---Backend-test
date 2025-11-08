import { OnboardingStatus } from '@/domain/value-objects/onboarding-status.vo';

export class UpdateOnboardingStatusDto {
  id: string;
  status: OnboardingStatus.APPROVED | OnboardingStatus.REJECTED;
}
