import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { IOnboardingApiPort } from '@/application/ports/onboarding-api.port';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HttpOnboardingApiAdapter implements IOnboardingApiPort {
  private readonly logger = new Logger(HttpOnboardingApiAdapter.name);
  private readonly onboardingServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const serviceUrl = this.configService.get<string>('ONBOARDING_SERVICE_URL');

    if (!serviceUrl) {
      throw new Error('ONBOARDING_SERVICE_URL is not configured');
    }

    this.onboardingServiceUrl = serviceUrl;
  }

  async notifyStatus(onboardingId: string, status: string): Promise<void> {
    const url = `${this.onboardingServiceUrl}/internal/onboarding/${onboardingId}/status`;

    const payload = { status };

    this.logger.log(`Enviando callback a: ${url} con payload: ${status}`);

    try {
      await firstValueFrom(this.httpService.patch(url, payload));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error al enviar callback a ${url}: ${message}`);

      throw new Error(
        `Fallo en la comunicación con el servicio de onboarding: ${message}`,
      );
    }
  }
}
