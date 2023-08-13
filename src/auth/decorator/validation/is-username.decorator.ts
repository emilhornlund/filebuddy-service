import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, Length, Matches } from 'class-validator';

/**
 * IsUsername is a custom decorator for validation of username inputs.
 * It applies a series of validation decorators:
 * - IsNotEmpty: Checks if the provided username is not empty.
 * - Length: Checks if the length of the username is between 4 and 20 characters.
 * - Matches: Checks if the username contains only alphanumeric characters.
 *
 * @returns {PropertyDecorator} - The series of validation decorators.
 */
export function IsUsername() {
  return applyDecorators(
    IsNotEmpty({
      message: ({ property }) => `${property} should not be empty`,
    }),
    Length(4, 20, {
      message: ({ property }) =>
        `${property} must be between 4 and 20 characters`,
    }),
    Matches(/^[a-zA-Z0-9]+$/, {
      message: ({ property }) =>
        `${property} must contain only alphanumeric characters`,
    }),
  );
}
