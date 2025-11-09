import { HttpStatus } from '@nestjs/common';
import { InvalidCredentialsException } from '@/domain/exceptions/invalid-credentials.exception';
import { InvalidCredentialsExceptionFilter } from './invalid-credentials-exception.filter';

describe('InvalidCredentialsExceptionFilter', () => {
  it('should map InvalidCredentialsException to 401 response', () => {
    const filter = new InvalidCredentialsExceptionFilter();
    const exception = new InvalidCredentialsException();

    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });

    const host: any = {
      switchToHttp: () => ({
        getResponse: () => ({ status }),
      }),
    };

    filter.catch(exception, host as any);

    expect(status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(json).toHaveBeenCalledWith({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: exception.message,
      error: 'Unauthorized',
    });
  });
});
