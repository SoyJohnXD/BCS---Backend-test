export const IValidationApiPort = Symbol('IValidationApiPort');

export interface IValidationApiPort {
  /**
   * Solicita el inicio de una validación para una solicitud de onboarding.
   *
   * @param onboardingId El ID de la solicitud a validar.
   */
  requestValidation(onboardingId: string): Promise<void>;
}
