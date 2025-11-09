export class OnboardingProductNotFoundException extends Error {
  constructor(public readonly productId: string) {
    super(`Product ${productId} not found`);
    this.name = 'OnboardingProductNotFoundException';
  }
}
