export interface CreateOnboardingUseCaseDto {
  name: string;
  documentNumber: string;
  email: string;
  initialAmount: number;
  productId: string;
  createdByUserId: string;
}

export interface CreateOnboardingUseCaseResultDto {
  onboardingId: string;
  status: string;
}
