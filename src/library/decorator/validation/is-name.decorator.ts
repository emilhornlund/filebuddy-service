import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, Length, Matches } from 'class-validator';

/**
 * A custom decorator for validating names.
 *
 * Rules:
 * 1. The name should not be empty.
 * 2. The length of the name should be between 2 and 20 characters.
 * 3. The name must contain only alphanumeric characters, spaces, dots, hyphens, and underscores.
 *
 * @returns A set of decorators from `class-validator` that enforce the name rules.
 *
 * @example
 * class CreateLibraryDto {
 *   @IsName()
 *   name: string;
 * }
 */
export const IsName = () =>
  applyDecorators(
    IsNotEmpty({
      message: ({ property }) => `${property} should not be empty`,
    }),
    Length(2, 20, {
      message: ({ property }) =>
        `${property} must be between 2 and 20 characters`,
    }),
    Matches(/^[a-zA-Z0-9.-_ ]+$/, {
      message: ({ property }) =>
        `${property} must contain only alphanumeric characters`,
    }),
  );
