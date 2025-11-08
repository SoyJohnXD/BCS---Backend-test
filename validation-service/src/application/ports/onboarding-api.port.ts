export const IOnboardingApiPort = Symbol('IOnboardingApiPort');

export interface IOnboardingApiPort {
  notifyStatus(onboardingId: string, status: string): Promise<void>;
}
