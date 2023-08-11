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
export function IsName() {
  return applyDecorators(
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
}

/**
 * A custom decorator for validating paths that point to directories (not actual files).
 *
 * Rules:
 * 1. The path should not be empty.
 * 2. The path should start with a `/` (root directory).
 * 3. Allowed characters in the path include alphanumeric characters, spaces, dots, hyphens, and underscores.
 *    Each segment of the path is separated by a `/`.
 * 4. The path should not end with a filename that includes an extension.
 *
 * @returns A set of decorators from `class-validator` that enforce the directory path rules.
 *
 * @example
 * class CreateDirectoryDto {
 *   @IsDirectoryPath()
 *   path: string;
 * }
 */
export function IsDirectoryPath() {
  return applyDecorators(
    IsNotEmpty({
      message: ({ property }) => `${property} should not be empty`,
    }),
    Matches(/^\/[a-zA-Z0-9.-_ \/]+(?<!\.[a-zA-Z0-9]{1,10})$/, {
      message: ({ property }) =>
        `${property} must be a valid directory path, starting with a '/' and containing only valid characters. The path should not end with a filename and extension.`,
    }),
  );
}
