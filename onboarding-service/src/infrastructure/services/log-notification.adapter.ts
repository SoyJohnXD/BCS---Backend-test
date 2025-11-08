import { Injectable, Logger } from '@nestjs/common';
import { INotificationPort } from '@/application/ports/notification.port';
import { OnboardingStatus } from '@/domain/value-objects/onboarding-status.vo';

@Injectable()
export class LogNotificationAdapter implements INotificationPort {
  private readonly logger = new Logger(LogNotificationAdapter.name);

  async sendOnboardingResult(
    email: string,
    name: string,
    status: OnboardingStatus.APPROVED | OnboardingStatus.REJECTED,
  ): Promise<void> {
    const statusText =
      status === OnboardingStatus.APPROVED ? 'APPROVED' : 'REJECTED';
    const subject = `Your onboarding request has been ${statusText}`;
    const body = `Hi ${name}, we inform you that your onboarding request has been ${statusText}.`;

    this.logger.log('--- ✉️ NOTIFICATION SIMULATION ---');
    this.logger.log(`To: ${email}`);
    this.logger.log(`Subject: ${subject}`);
    this.logger.log(`Body: ${body}`);
    this.logger.log('----------------------------------');

    return Promise.resolve();
  }
}
