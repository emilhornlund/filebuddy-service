import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { ValidationFailedException } from '../exception';
import { ResponseTransformer } from '../utility';

/**
 * Exception filter that handles all exceptions thrown in the application.
 *
 * @remarks
 * This class is a part of NestJS's Exception Filters mechanism that
 * handles exceptions across the whole application.
 *
 * @Catch
 * @implements {ExceptionFilter}
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  /**
   * Create an instance of the `AllExceptionsFilter` class.
   *
   * @param httpAdapterHost - A wrapper around the native HTTP server library.
   */
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  /**
   * Method that's called by the NestJS filter pipeline to catch and handle exceptions.
   *
   * @param exception - The caught exception object.
   * @param host - Arguments passed to the original method where the exception was thrown.
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Unexpected error';

    const validationErrors =
      exception instanceof ValidationFailedException
        ? exception.validationErrors.map(({ constraints, property }) => ({
            constraints,
            property,
          }))
        : undefined;

    const responseBody = {
      message,
      validationErrors,
      timestamp: new Date().toISOString(),
    };

    const transformedResponseBody =
      ResponseTransformer.transformToSnakeCase(responseBody);
    httpAdapter.reply(ctx.getResponse(), transformedResponseBody, httpStatus);
  }
}
