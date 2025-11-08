import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { LogNotificationAdapter } from './log-notification.adapter';
import { OnboardingStatus } from '@/domain/value-objects/onboarding-status.vo';

describe('LogNotificationAdapter', () => {
  let adapter: LogNotificationAdapter;
  let logSpy: jest.SpyInstance;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [LogNotificationAdapter],
    }).compile();

    adapter = module.get<LogNotificationAdapter>(LogNotificationAdapter);
    logSpy = jest
      .spyOn(Logger.prototype, 'log')
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(adapter).toBeDefined();
  });

  it('should log an APPROVED result', async () => {
    const name = 'John Doe';
    const email = 'john@test.com';
    const status = OnboardingStatus.APPROVED;

    await adapter.sendOnboardingResult(email, name, status);

    expect(logSpy).toHaveBeenCalledWith('--- ✉️ NOTIFICATION SIMULATION ---');
    expect(logSpy).toHaveBeenCalledWith('To: john@test.com');
    expect(logSpy).toHaveBeenCalledWith(
      'Subject: Your onboarding request has been APPROVED',
    );
    expect(logSpy).toHaveBeenCalledWith(
      'Body: Hi John Doe, we inform you that your onboarding request has been APPROVED.',
    );
  });

  it('should log a REJECTED result', async () => {
    const name = 'Jane Doe';
    const email = 'jane@test.com';
    const status = OnboardingStatus.REJECTED;

    await adapter.sendOnboardingResult(email, name, status);

    expect(logSpy).toHaveBeenCalledWith('--- ✉️ NOTIFICATION SIMULATION ---');
    expect(logSpy).toHaveBeenCalledWith('To: jane@test.com');
    expect(logSpy).toHaveBeenCalledWith(
      'Subject: Your onboarding request has been REJECTED',
    );
    expect(logSpy).toHaveBeenCalledWith(
      'Body: Hi Jane Doe, we inform you that your onboarding request has been REJECTED.',
    );
  });
});
