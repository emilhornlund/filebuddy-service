import { HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { buildErrorResponseSchema } from '../../../library/utility';

/**
 * Provides an API response decorator for unauthorized access.
 * This is typically used when a user tries to access an endpoint without providing
 * a valid bearer token or if the token is invalid.
 *
 * @returns {Function} An ApiResponse decorator configured for unauthorized access
 */
export const ApiAuthUnauthorizedResponse = () =>
  ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Authentication failed. This usually happens if no bearer token is provided or if the provided token is invalid.',
    schema: buildErrorResponseSchema({ message: { example: 'Unauthorized' } }),
  });
