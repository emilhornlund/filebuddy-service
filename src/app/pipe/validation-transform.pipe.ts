import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { ValidationFailedException } from '../exception';

/**
 * `ValidationTransformPipe` is a custom pipe that uses class-transformer and class-validator to
 * validate the input data.
 *
 * The `transform` method will convert the plain JavaScript object to a class object,
 * and then validate the class object.
 *
 * If the validation failed, it will throw a `ValidationFailedException`.
 *
 * @Injectable
 * @implements {PipeTransform<any>}
 */
@Injectable()
export class ValidationTransformPipe implements PipeTransform<any> {
  /**
   * Transforms the input value to an instance of the metatype and validates it.
   * If the validation fails, throws an exception.
   *
   * @param {any} value - The value to be transformed and validated.
   * @param {ArgumentMetadata} metadata - Metadata about the argument.
   *
   * @returns {Promise<any>} - The original value if validation passes.
   *
   * @throws {ValidationFailedException} - If validation fails.
   */
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new ValidationFailedException(errors);
    }
    return value;
  }

  /**
   * Checks whether the given metatype is not one of the basic JavaScript types.
   *
   * @param {Function} metatype - The metatype to check.
   *
   * @returns {boolean} - `true` if the metatype is not a basic type, `false` otherwise.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  private toValidate(metatype: Function): boolean {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
