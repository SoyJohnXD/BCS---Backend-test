import {
  Controller,
  Body,
  UseGuards,
  HttpException,
  HttpStatus,
  All,
  Req,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { firstValueFrom } from 'rxjs';
import { AxiosError, type Method } from 'axios';
import type { Request } from 'express';

@Controller('onboarding')
export class OnboardingController {
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

  /**
   * Protege y reenvía todas las solicitudes a /onboarding.
   * Este endpoint está protegido por JWT.
   *
   * @param body El cuerpo de la solicitud de onboarding.
   * @param req La solicitud Express original para reenviar el método y la ruta.
   * @returns La respuesta del servicio de onboarding.
   * @throws {HttpException} Si el servicio de onboarding responde con un error.
   */
  @All()
  @UseGuards(JwtAuthGuard)
  async proxyOnboarding(
    @Body() body: unknown,
    @Req() req: Request,
  ): Promise<unknown> {
    const url = `${this.onboardingServiceUrl}${req.path}`;
    const method = this.resolveHttpMethod(req.method);

    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method,
          url,
          data: body,
        }),
      );
      return response.data as unknown;
    } catch (unknownError) {
      if (unknownError instanceof AxiosError && unknownError.response) {
        const rawData = unknownError.response.data as unknown;
        const responsePayload = this.mapErrorPayload(rawData);

        throw new HttpException(
          responsePayload,
          unknownError.response.status as HttpStatus,
        );
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private resolveHttpMethod(rawMethod: string): Method {
    const allowedMethods: ReadonlyArray<Method> = [
      'get',
      'post',
      'put',
      'patch',
      'delete',
      'options',
      'head',
    ];

    const normalized = rawMethod.toLowerCase();
    const match = allowedMethods.find(
      (allowed) => allowed.toLowerCase() === normalized,
    );

    if (!match) {
      throw new HttpException(
        `Method ${rawMethod} is not allowed`,
        HttpStatus.METHOD_NOT_ALLOWED,
      );
    }

    return match;
  }

  private mapErrorPayload(payload: unknown): string | Record<string, unknown> {
    if (typeof payload === 'string') {
      return payload;
    }

    if (this.isRecord(payload)) {
      return payload;
    }

    return { message: 'Upstream onboarding service error' };
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }
}
