import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) =>
      key === 'JWT_SECRET' ? 'test-secret' : undefined,
    ),
  };

  const createMockExecutionContext = (
    request: Partial<Request>,
  ): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    const resolvedGuard = module.get<JwtAuthGuard>(JwtAuthGuard);
    guard = resolvedGuard;
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access for a valid token', async () => {
    const mockRequest = {
      headers: { authorization: 'Bearer valid-token' },
    } as Partial<Request>;

    const mockContext = createMockExecutionContext(mockRequest);
    const mockPayload = { sub: 'user-id', username: 'admin@bank.com' };

    mockJwtService.verifyAsync.mockResolvedValue(mockPayload);

    await expect(guard.canActivate(mockContext)).resolves.toBe(true);
    expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('valid-token', {
      secret: 'test-secret',
    });
  });

  it('should throw UnauthorizedException if no token is provided', async () => {
    const mockRequest = { headers: {} } as Partial<Request>;
    const mockContext = createMockExecutionContext(mockRequest);
    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if token type is not Bearer', async () => {
    const mockRequest = {
      headers: { authorization: 'Basic some-other-token' },
    } as Partial<Request>;
    const mockContext = createMockExecutionContext(mockRequest);
    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if token verification fails', async () => {
    const mockRequest = {
      headers: { authorization: 'Bearer expired-or-invalid-token' },
    } as Partial<Request>;
    const mockContext = createMockExecutionContext(mockRequest);
    const error = new Error('Token expired');
    mockJwtService.verifyAsync.mockRejectedValue(error);

    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(
      'expired-or-invalid-token',
      { secret: 'test-secret' },
    );
  });
});
