import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { IValidationApiPort } from '@/application/ports/validation-api.port';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HttpValidationApiAdapter implements IValidationApiPort {
  private readonly logger = new Logger(HttpValidationApiAdapter.name);
  private readonly validationServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.validationServiceUrl = this.configService.get<string>(
      'VALIDATION_SERVICE_URL',
    );
  }

  async requestValidation(onboardingId: string): Promise<void> {
    const url = `${this.validationServiceUrl}/validate`;
    const payload = { onboardingId };

    this.logger.log(`Enviando solicitud a: ${url} con ID: ${onboardingId}`);

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, payload),
      );

      this.logger.log(
        `Solicitud de validación aceptada para: ${onboardingId}, Status: ${response.status}`,
      );
    } catch (error) {
      this.logger.error(
        `Error al solicitar validación a ${url}: ${error.message}`,
      );

      throw new Error(`Fallo en la comunicación con el servicio de validación`);
    }
  }
}
