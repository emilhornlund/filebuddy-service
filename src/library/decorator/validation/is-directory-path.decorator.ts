import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, Matches } from 'class-validator';

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
export const IsDirectoryPath = () =>
  applyDecorators(
    IsNotEmpty({
      message: ({ property }) => `${property} should not be empty`,
    }),
    Matches(/^\/[a-zA-Z0-9.-_ \/]+(?<!\.[a-zA-Z0-9]{1,10})$/, {
      message: ({ property }) =>
        `${property} must be a valid directory path, starting with a '/' and containing only valid characters. The path should not end with a filename and extension.`,
    }),
  );
