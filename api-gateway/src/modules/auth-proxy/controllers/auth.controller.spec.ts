import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { of, throwError } from 'rxjs';
import { AxiosError, type AxiosResponse } from 'axios';
import { HttpStatus } from '@nestjs/common';

type HttpServiceMock = Pick<jest.Mocked<HttpService>, 'request'>;

const createHttpServiceMock = (): HttpServiceMock => ({ request: jest.fn() });

const createConfigServiceMock = (
  serviceUrl = 'http://fake-auth-service:3001',
) => ({
  get: jest.fn((key: string) =>
    key === 'AUTH_SERVICE_URL' ? serviceUrl : undefined,
  ),
});

describe('AuthController', () => {
  let controller: AuthController;
  let httpServiceMock: HttpServiceMock;
  let configServiceMock: ReturnType<typeof createConfigServiceMock>;

  beforeEach(async () => {
    jest.clearAllMocks();
    httpServiceMock = createHttpServiceMock();
    configServiceMock = createConfigServiceMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: HttpService, useValue: httpServiceMock },
        { provide: ConfigService, useValue: configServiceMock },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should proxy POST request to auth service (login)', async () => {
    const mockRequest = { path: '/login', method: 'POST' } as Request;
    const mockBody = { email: 'user@example.com', password: '123456' };
    const mockResponseData = { token: 'jwt-token-here', userId: '123' };

    httpServiceMock.request.mockReturnValue(
      of({
        data: mockResponseData,
        status: 200,
      } as AxiosResponse<typeof mockResponseData>),
    );

    const result = await controller.proxyAuth(mockBody, mockRequest);
    expect(result).toEqual(mockResponseData);
    expect(httpServiceMock.request).toHaveBeenCalledWith({
      method: 'post',
      url: 'http://fake-auth-service:3001/login',
      data: mockBody,
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('should proxy POST request to auth service (register)', async () => {
    const mockRequest = { path: '/register', method: 'POST' } as Request;
    const mockBody = {
      email: 'newuser@example.com',
      password: '123456',
      name: 'New User',
    };
    const mockResponseData = { userId: '456', created: true };

    httpServiceMock.request.mockReturnValue(
      of({
        data: mockResponseData,
        status: 201,
      } as AxiosResponse<typeof mockResponseData>),
    );

    const result = await controller.proxyAuth(mockBody, mockRequest);
    expect(result).toEqual(mockResponseData);
    expect(httpServiceMock.request).toHaveBeenCalledWith({
      method: 'post',
      url: 'http://fake-auth-service:3001/register',
      data: mockBody,
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('should propagate AxiosError as HttpException', async () => {
    const mockRequest = { path: '/login', method: 'POST' } as Request;
    const mockBody = { email: 'wrong@example.com', password: 'wrong' };
    const mockErrorResponse = {
      message: 'Invalid credentials',
      statusCode: 401,
    };

    const axiosError = new AxiosError('Unauthorized');
    axiosError.response = {
      data: mockErrorResponse,
      status: 401,
    } as AxiosResponse<typeof mockErrorResponse>;

    httpServiceMock.request.mockReturnValue(throwError(() => axiosError));

    await expect(
      controller.proxyAuth(mockBody, mockRequest),
    ).rejects.toMatchObject({
      response: mockErrorResponse,
      status: HttpStatus.UNAUTHORIZED,
    });
  });

  it('should forward request when path is root "/"', async () => {
    const mockRequest = { path: '/', method: 'GET' } as Request;
    httpServiceMock.request.mockReturnValue(
      of({ data: { status: 'ok' }, status: 200 } as AxiosResponse),
    );
    await controller.proxyAuth({}, mockRequest);
    expect(httpServiceMock.request).toHaveBeenCalledWith(
      expect.objectContaining({ url: 'http://fake-auth-service:3001/' }),
    );
  });
});
