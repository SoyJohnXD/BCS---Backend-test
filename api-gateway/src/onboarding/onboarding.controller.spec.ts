import { Test, TestingModule } from '@nestjs/testing';
import { OnboardingController } from './onboarding.controller';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import type { Request } from 'express';
import { of, throwError } from 'rxjs';
import { AxiosError, type AxiosResponse } from 'axios';
import { HttpStatus } from '@nestjs/common';

type HttpServiceMock = Pick<jest.Mocked<HttpService>, 'request'>;

const createHttpServiceMock = (): HttpServiceMock => ({
  request: jest.fn(),
});

const createConfigServiceMock = (
  serviceUrl = 'http://fake-onboarding-service:3000',
) => ({
  get: jest.fn((key: string) =>
    key === 'ONBOARDING_SERVICE_URL' ? serviceUrl : undefined,
  ),
});

const mockAuthGuard = {
  canActivate: jest.fn(() => true),
};

describe('OnboardingController', () => {
  let controller: OnboardingController;
  let httpServiceMock: HttpServiceMock;
  let configServiceMock: ReturnType<typeof createConfigServiceMock>;

  beforeEach(async () => {
    jest.clearAllMocks();

    httpServiceMock = createHttpServiceMock();
    configServiceMock = createConfigServiceMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OnboardingController],
      providers: [
        { provide: HttpService, useValue: httpServiceMock },
        { provide: ConfigService, useValue: configServiceMock },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<OnboardingController>(OnboardingController);
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

    httpServiceMock.request.mockReturnValue(
      of({
        data: mockResponseData,
        status: 201,
      } as AxiosResponse<typeof mockResponseData>),
    );

    const result = await controller.proxyOnboarding(mockBody, mockRequest);

    expect(result).toEqual(mockResponseData);

    expect(httpServiceMock.request).toHaveBeenCalledTimes(1);
    expect(httpServiceMock.request).toHaveBeenCalledWith({
      method: 'post',
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
    } as AxiosResponse<typeof mockErrorResponse>;

    httpServiceMock.request.mockReturnValue(throwError(() => axiosError));

    await expect(
      controller.proxyOnboarding(mockBody, mockRequest),
    ).rejects.toMatchObject({
      response: mockErrorResponse,
      status: HttpStatus.BAD_REQUEST,
    });
  });
});
