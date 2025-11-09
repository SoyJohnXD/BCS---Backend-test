import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { OnboardingRequestInProgressException } from '@/domain/exceptions/onboarding-request-in-progress.exception';

@Catch(OnboardingRequestInProgressException)
export class OnboardingInProgressExceptionFilter implements ExceptionFilter {
  catch(exception: OnboardingRequestInProgressException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    return res.status(HttpStatus.CONFLICT).json({
      statusCode: HttpStatus.CONFLICT,
      message: exception.message,
      error: 'Conflict',
    });
  }
}
