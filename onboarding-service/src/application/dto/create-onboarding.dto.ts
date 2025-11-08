export interface CreateOnboardingUseCaseDto {
  name: string;
  documentNumber: string;
  email: string;
  initialAmount: number;
}

export interface CreateOnboardingUseCaseResultDto {
  onboardingId: string;
  status: string;
}
