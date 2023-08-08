import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, Length, Matches } from 'class-validator';

/**
 * IsPassword is a custom decorator for validation of password inputs.
 * It applies a series of validation decorators:
 * - IsNotEmpty: Checks if the provided password is not empty.
 * - Length: Checks if the length of the password is between 8 and 30 characters.
 * - Matches: Checks if the password contains at least one uppercase letter, one lowercase letter, one number, and one special character.
 *
 * @returns {PropertyDecorator} - The series of validation decorators.
 */
export function IsPassword() {
  return applyDecorators(
    IsNotEmpty({
      message: ({ property }) => `${property} should not be empty`,
    }),
    Length(8, 30, {
      message: ({ property }) =>
        `${property} must be between 8 and 30 characters`,
    }),
    Matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/,
      {
        message: ({ property }) =>
          `${property} must have at least one uppercase letter, one lowercase letter, one number, and one special character`,
      },
    ),
  );
}
