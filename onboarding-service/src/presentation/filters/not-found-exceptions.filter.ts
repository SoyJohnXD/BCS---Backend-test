import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { OnboardingProductNotFoundException } from '@/domain/exceptions/product-not-found.exception';
import { OnboardingRequestNotFoundException } from '@/domain/exceptions/onboarding-request-not-found.exception';

type NotFoundExceptions =
  | OnboardingProductNotFoundException
  | OnboardingRequestNotFoundException;

@Catch(OnboardingProductNotFoundException, OnboardingRequestNotFoundException)
export class OnboardingNotFoundExceptionsFilter implements ExceptionFilter {
  catch(exception: NotFoundExceptions, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    return res.status(HttpStatus.NOT_FOUND).json({
      statusCode: HttpStatus.NOT_FOUND,
      message: exception.message,
      error: 'Not Found',
    });
  }
}
