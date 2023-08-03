import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { AbstractHttpAdapter, HttpAdapterHost } from '@nestjs/core';

import { ValidationFailedException } from '../exception';
import { AllExceptionsFilter } from './all-exceptions.filter';

describe('AllExceptionsFilter', () => {
  let allExceptionsFilter: AllExceptionsFilter;
  let httpAdapter: AbstractHttpAdapter;
  let host: ArgumentsHost;

  beforeEach(() => {
    httpAdapter = {
      reply: jest.fn(),
    } as any;

    const httpAdapterHost = { httpAdapter };
    allExceptionsFilter = new AllExceptionsFilter(
      httpAdapterHost as HttpAdapterHost,
    );

    host = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn(),
      }),
    } as any;
  });

  it('should handle HttpException', () => {
    const exception = new HttpException(
      'Test Exception',
      HttpStatus.BAD_REQUEST,
    );
    allExceptionsFilter.catch(exception, host as ArgumentsHost);

    expect(httpAdapter.reply).toHaveBeenCalledWith(
      host.switchToHttp().getResponse(),
      expect.objectContaining({
        message: 'Test Exception',
        timestamp: expect.any(String),
      }),
      HttpStatus.BAD_REQUEST,
    );
  });

  it('should handle ValidationFailedException', () => {
    const exception = new ValidationFailedException([
      { constraints: { isString: 'prop must be a string' }, property: 'prop' },
    ]);
    allExceptionsFilter.catch(exception, host as ArgumentsHost);

    expect(httpAdapter.reply).toHaveBeenCalledWith(
      host.switchToHttp().getResponse(),
      expect.objectContaining({
        message: 'Validation failed',
        timestamp: expect.any(String),
        validation_errors: [
          {
            constraints: { is_string: 'prop must be a string' },
            property: 'prop',
          },
        ],
      }),
      HttpStatus.BAD_REQUEST,
    );
  });

  it('should handle other exceptions', () => {
    const exception = new Error('Unexpected error');
    allExceptionsFilter.catch(exception, host as ArgumentsHost);

    expect(httpAdapter.reply).toHaveBeenCalledWith(
      host.switchToHttp().getResponse(),
      expect.objectContaining({
        message: 'Unexpected error',
        timestamp: expect.any(String),
      }),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  });
});
