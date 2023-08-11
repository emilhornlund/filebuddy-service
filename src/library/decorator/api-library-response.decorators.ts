import { HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { buildErrorResponseSchema } from '../utility';

export const ApiLibraryValidationFailedResponse = () =>
  ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Validation failed due to one or more input properties being incorrect or missing.',
    schema: buildErrorResponseSchema({
      message: { example: 'Validation failed' },
      validationErrors: [
        {
          constraints: {
            is_length: 'name must be between 2 and 20 characters',
            is_not_empty: 'name should not be empty',
            matches: 'name must contain only alphanumeric characters',
          },
          property: 'name',
        },
        {
          constraints: {
            is_not_empty: 'path should not be empty',
            matches:
              "path must be a valid directory path, starting with a '/' and containing only valid characters. The path should not end with a filename and extension.",
          },
          property: 'path',
        },
      ],
    }),
  });

export const ApiLibraryUnauthorizedResponse = () =>
  ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Authentication failed. This usually happens if no bearer token is provided or if the provided token is invalid.',
    schema: buildErrorResponseSchema({ message: { example: 'Unauthorized' } }),
  });

export const ApiLibraryForbiddenResponse = () =>
  ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      "The user doesn't have the required `LIBRARY_MANAGEMENT` authority to perform this operation.",
    schema: buildErrorResponseSchema({
      message: { example: 'Forbidden resource' },
    }),
  });

export const ApiLibraryPathConflictResponse = () =>
  ApiResponse({
    status: HttpStatus.CONFLICT,
    description:
      'The provided library path is not unique. A library with the same path already exists in the system.',
    schema: buildErrorResponseSchema({
      message: { example: 'Path `/absolute/path/to/library` was not unique.' },
    }),
  });
