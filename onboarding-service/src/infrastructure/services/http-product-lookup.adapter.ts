import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { IProductLookupPort } from '@/application/ports/product-lookup.port';

@Injectable()
export class HttpProductLookupAdapter implements IProductLookupPort {
  private readonly logger = new Logger(HttpProductLookupAdapter.name);
  private readonly baseUrl: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    this.baseUrl =
      this.config.get<string>('PRODUCT_SERVICE_URL') ??
      'http://product-service:3000';
  }

  async exists(productId: string): Promise<boolean> {
    try {
      await firstValueFrom(
        this.http.get(`${this.baseUrl}/products/${productId}`),
      );
      return true;
    } catch (e) {
      if (e instanceof AxiosError && e.response?.status === 404) {
        return false;
      }
      const message = e instanceof Error ? e.message : 'Unknown error';
      this.logger.error(`Product lookup failed: ${message}`);
      throw e;
    }
  }
}
