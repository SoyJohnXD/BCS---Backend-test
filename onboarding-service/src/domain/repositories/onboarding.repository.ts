import { OnboardingRequest } from '../entities/onboarding-request.entity';

export const IOnboardingRepository = Symbol('IOnboardingRepository');

export interface IOnboardingRepository {
  /**
   * Guarda (crea o actualiza) una solicitud de onboarding en la base de datos.
   * @param request La entidad OnboardingRequest que se va a guardar.
   */
  save(request: OnboardingRequest): Promise<void>;

  /**
   * Busca una solicitud de onboarding por su ID único.
   * @param id El ID de la solicitud.
   * @returns La entidad o null si no se encuentra.
   */
  findById(id: string): Promise<OnboardingRequest | null>;

  /**
   * Actualiza el estado de una solicitud existente.
   * @param request La entidad actualizada.
   */
  update(request: OnboardingRequest): Promise<void>;
}
