import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

/**
 * This class represents a specific type of HTTP Exception that gets thrown when
 * validation of a request data fails. This extends the base `HttpException` from NestJS.
 *
 * @property validationErrors - An array of validation errors from class-validator.
 *
 * @example
 * ```ts
 * throw new ValidationFailedException(validationErrors);
 * ```
 */
export class ValidationFailedException extends HttpException {
  /** Contains an array of validation errors. */
  validationErrors: ValidationError[];

  /**
   * Creates a new instance of the `ValidationFailedException`.
   * @param validationErrors - An array of validation errors.
   */
  constructor(validationErrors: ValidationError[]) {
    super('Validation failed', HttpStatus.BAD_REQUEST);
    this.validationErrors = validationErrors;
  }
}
