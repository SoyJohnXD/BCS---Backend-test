export class OnboardingRequestNotFoundException extends Error {
  constructor(id: string) {
    super(`Onboarding request with ID "${id}" not found.`);
    this.name = 'OnboardingRequestNotFoundException';
  }
}
