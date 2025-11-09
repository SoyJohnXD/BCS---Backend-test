import { of, throwError } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { HttpProductLookupAdapter } from './http-product-lookup.adapter';

describe('HttpProductLookupAdapter', () => {
  let http: jest.Mocked<HttpService>;
  let config: jest.Mocked<ConfigService>;
  let adapter: HttpProductLookupAdapter;

  beforeEach(() => {
    http = { get: jest.fn() } as any;
    config = {
      get: jest.fn().mockReturnValue('http://product-service:3000'),
    } as any;
    adapter = new HttpProductLookupAdapter(http, config);
  });

  it('debe retornar true cuando el product-service responde 200', async () => {
    http.get.mockReturnValueOnce(of({ data: {} } as any));
    await expect(adapter.exists('prod-1')).resolves.toBe(true);
    expect(http.get).toHaveBeenCalledWith(
      'http://product-service:3000/products/prod-1',
    );
  });

  it('debe retornar false cuando el product-service responde 404', async () => {
    const err404 = new AxiosError(
      'Not Found',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config: {} as any,
        data: {},
      } as any,
    );
    http.get.mockReturnValueOnce(throwError(() => err404));
    await expect(adapter.exists('missing')).resolves.toBe(false);
  });

  it('debe lanzar error cuando el product-service responde 5xx u otro error', async () => {
    const err500 = new AxiosError(
      'Internal Error',
      'ERR_BAD_RESPONSE',
      undefined,
      undefined,
      {
        status: 500,
        statusText: 'Internal Server Error',
        headers: {},
        config: {} as any,
        data: {},
      } as any,
    );
    http.get.mockReturnValueOnce(throwError(() => err500));
    await expect(adapter.exists('any')).rejects.toBe(err500);
  });
});
