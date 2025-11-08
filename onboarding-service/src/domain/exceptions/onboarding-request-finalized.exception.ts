export class OnboardingRequestFinalizedException extends Error {
  constructor(id: string, status: string) {
    super(
      `The onboarding request with ID "${id}" is already finalized with status "${status}" and cannot be modified.`,
    );
    this.name = 'OnboardingRequestFinalizedException';
  }
}
