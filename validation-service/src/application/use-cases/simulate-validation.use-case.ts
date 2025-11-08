import { Inject, Injectable, Logger } from '@nestjs/common';
import { IOnboardingApiPort } from '../ports/onboarding-api.port';
import { ValidateOnboardingDto } from '../dto/validate-onboarding.dto';

@Injectable()
export class SimulateValidationUseCase {
  private readonly logger = new Logger(SimulateValidationUseCase.name);
  private readonly SIMULATION_TIME_MS = 10000;
  private readonly APPROVAL_CHANCE = 0.8;

  constructor(
    @Inject(IOnboardingApiPort)
    private readonly onboardingApi: IOnboardingApiPort,
  ) {}

  /**
   * Ejecuta el caso de uso de simulación de validación.
   * Este método se ejecuta y no devuelve nada (fire-and-forget).
   * @param dto El DTO con el onboardingId a validar.
   */
  async execute(dto: ValidateOnboardingDto): Promise<void> {
    this.logger.log(
      `Iniciando validación para: ${dto.onboardingId}... (Durará 10s)`,
    );

    await this.delay(this.SIMULATION_TIME_MS);

    const finalStatus =
      Math.random() < this.APPROVAL_CHANCE ? 'APPROVED' : 'REJECTED';

    this.logger.log(
      `Validación completada para: ${dto.onboardingId}. Resultado: ${finalStatus}`,
    );

    try {
      await this.onboardingApi.notifyStatus(dto.onboardingId, finalStatus);
      this.logger.log(`Notificación enviada para: ${dto.onboardingId}`);
    } catch (error) {
      this.logger.error(
        `Fallo al notificar al onboarding-service para: ${dto.onboardingId}`,
        error.message,
      );
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
