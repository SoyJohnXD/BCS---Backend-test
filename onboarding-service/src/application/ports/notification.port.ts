import { OnboardingStatus } from '@/domain/value-objects/onboarding-status.vo';

export const INotificationPort = Symbol('INotificationPort');

export interface INotificationPort {
  /**
   * Envía una notificación (ej. email) al usuario con el resultado final.
   * @param email Email del cliente.
   * @param name Nombre del cliente.
   * @param status El estado final (APPROVED o REJECTED).
   */
  sendOnboardingResult(
    email: string,
    name: string,
    status: OnboardingStatus.APPROVED | OnboardingStatus.REJECTED,
  ): Promise<void>;
}
