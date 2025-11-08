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
import { AxiosError } from 'axios';
import { Request } from 'express';

@Controller('onboarding')
export class OnboardingController {
  private readonly onboardingServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.onboardingServiceUrl = this.configService.get<string>(
      'ONBOARDING_SERVICE_URL',
    );
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
  async proxyOnboarding(@Body() body: unknown, @Req() req: Request) {
    const url = `${this.onboardingServiceUrl}${req.path}`;

    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method: req.method as any,
          url: url,
          data: body,
        }),
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new HttpException(
          error.response.data,
          error.response.status as HttpStatus,
        );
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
