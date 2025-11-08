import { Test, TestingModule } from '@nestjs/testing';
import { OnboardingController } from './onboarding.controller';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Request } from 'express';
import { of, throwError } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { HttpException, HttpStatus } from '@nestjs/common';

const mockHttpService = {
  request: jest.fn(),
};

const mockConfigService = {
  get: jest.fn((key: string) => {
    if (key === 'ONBOARDING_SERVICE_URL') {
      return 'http://fake-onboarding-service:3000';
    }
    return null;
  }),
};

const mockAuthGuard = {
  canActivate: jest.fn(() => true),
};

describe('OnboardingController', () => {
  let controller: OnboardingController;
  let httpService: HttpService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OnboardingController],
      providers: [
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<OnboardingController>(OnboardingController);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should proxy the request (happy path)', async () => {
    const mockRequest = {
      path: '/test-path',
      method: 'POST',
    } as Request;
    const mockBody = { name: 'test' };
    const mockResponseData = { id: '123', status: 'REQUESTED' };

    mockHttpService.request.mockReturnValue(
      of({
        data: mockResponseData,
        status: 201,
      } as AxiosResponse),
    );

    const result = await controller.proxyOnboarding(mockBody, mockRequest);

    expect(result).toEqual(mockResponseData);

    expect(httpService.request).toHaveBeenCalledTimes(1);
    expect(httpService.request).toHaveBeenCalledWith({
      method: 'POST',
      url: 'http://fake-onboarding-service:3000/test-path',
      data: mockBody,
    });
  });

  it('should propagate AxiosError as HttpException', async () => {
    const mockRequest = {
      path: '/test-error',
      method: 'POST',
    } as Request;
    const mockBody = { name: '' };
    const mockErrorResponse = {
      message: 'Name is required',
      statusCode: 400,
    };

    const axiosError = new AxiosError('Bad Request');
    axiosError.response = {
      data: mockErrorResponse,
      status: 400,
    } as AxiosResponse;

    mockHttpService.request.mockReturnValue(throwError(() => axiosError));

    await expect(
      controller.proxyOnboarding(mockBody, mockRequest),
    ).rejects.toThrow(HttpException);

    try {
      await controller.proxyOnboarding(mockBody, mockRequest);
    } catch (error) {
      expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      expect(error.response).toEqual(mockErrorResponse);
    }
  });
});
