import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { InvalidProductNameException } from '@/domain/exceptions/invalid-product-name.exception';
import { MissingShortDescriptionException } from '@/domain/exceptions/missing-short-description.exception';

@Catch(InvalidProductNameException, MissingShortDescriptionException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const badRequest = new BadRequestException({
      statusCode: 400,
      error: 'Bad Request',
      message: exception.message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });

    const status = badRequest.getStatus();
    const body = badRequest.getResponse();
    response.status(status).json(body);
  }
}
