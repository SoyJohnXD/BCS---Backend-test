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
import { JwtAuthGuard } from '@/modules/security/guards/jwt-auth.guard';
import { firstValueFrom } from 'rxjs';
import { AxiosError, type Method } from 'axios';
import type { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    sub: string;
    [key: string]: unknown;
  };
}

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

  @All()
  @UseGuards(JwtAuthGuard)
  async proxyOnboarding(
    @Body() body: unknown,
    @Req() req: AuthenticatedRequest,
  ): Promise<unknown> {
    const url = `${this.onboardingServiceUrl}${req.path}`;
    const method = this.resolveHttpMethod(req.method);
    const authHeader = req.headers?.authorization;
    const userId = req.user?.sub;

    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method,
          url,
          data: body,
          headers: this.buildForwardHeaders(authHeader, userId),
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

  private buildForwardHeaders(
    authHeader?: string,
    userId?: string,
  ): Record<string, string> {
    const headers: Record<string, string> = {};
    if (authHeader) {
      headers.Authorization = authHeader;
    }
    if (userId) {
      headers['x-user-id'] = userId;
    }
    return headers;
  }
}
