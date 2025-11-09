export class OnboardingRequestInProgressException extends Error {
  constructor(
    public readonly userId: string,
    public readonly productId: string,
  ) {
    super(
      `There's already an active onboarding request for user ${userId} and product ${productId}`,
    );
    this.name = 'OnboardingRequestInProgressException';
  }
}
