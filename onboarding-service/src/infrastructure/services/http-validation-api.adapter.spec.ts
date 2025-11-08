import { Test, TestingModule } from '@nestjs/testing';
import { HttpValidationApiAdapter } from './http-validation-api.adapter';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const mockHttpService = {
  post: jest.fn(),
};

const mockConfigService = {
  get: jest.fn(() => 'http://fake-validation-service:3000'),
};

describe('HttpValidationApiAdapter', () => {
  let adapter: HttpValidationApiAdapter;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HttpValidationApiAdapter,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    adapter = module.get<HttpValidationApiAdapter>(HttpValidationApiAdapter);
  });

  it('should be defined', () => {
    expect(adapter).toBeDefined();
  });

  it('should call httpService.post with correct URL and payload', async () => {
    const onboardingId = 'test-id-123';
    const expectedUrl = 'http://fake-validation-service:3000/validate';
    const expectedPayload = { onboardingId };

    const axiosResponse: AxiosResponse = {
      status: 202,
      statusText: 'Accepted',
      headers: {},
      config: { headers: {} } as InternalAxiosRequestConfig,
      data: {},
    };
    mockHttpService.post.mockReturnValue(of(axiosResponse));

    await adapter.requestValidation(onboardingId);

    expect(mockHttpService.post).toHaveBeenCalledTimes(1);
    expect(mockHttpService.post).toHaveBeenCalledWith(
      expectedUrl,
      expectedPayload,
    );
  });

  it('should throw an error if httpService.post fails', async () => {
    const onboardingId = 'fail-id-456';
    const error = new AxiosError('Service Unavailable');
    error.response = {
      status: 503,
      statusText: 'Service Unavailable',
      headers: {},
      config: { headers: {} } as InternalAxiosRequestConfig,
      data: {},
    } as AxiosResponse;

    mockHttpService.post.mockReturnValue(throwError(() => error));

    await expect(adapter.requestValidation(onboardingId)).rejects.toThrow(
      'Fallo en la comunicación con el servicio de validación',
    );
  });
});
