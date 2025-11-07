export interface CreateOnboardingUseCaseDto {
  nombre: string;
  documento: string;
  email: string;
  montoInicial: number;
}

export interface CreateOnboardingUseCaseResultDto {
  onboardingId: string;
  status: string;
}
