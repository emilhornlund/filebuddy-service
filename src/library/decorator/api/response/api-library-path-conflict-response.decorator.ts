import { HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { buildErrorResponseSchema } from '../../../utility';

/**
 * Provides an API response decorator for library path conflict.
 *
 * Indicates that the provided library path already exists in the system.
 *
 * @returns {Function} An ApiResponse decorator configured for library path conflict.
 */
export const ApiLibraryPathConflictResponse = () =>
  ApiResponse({
    status: HttpStatus.CONFLICT,
    description:
      'The provided library path is not unique. A library with the same path already exists in the system.',
    schema: buildErrorResponseSchema({
      message: { example: 'Path `/absolute/path/to/library` was not unique.' },
    }),
  });
