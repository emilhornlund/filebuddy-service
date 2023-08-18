import { HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { buildErrorResponseSchema } from '../../../library/utility';
import { AuthoritiesDto } from '../../model/security';

/**
 * Provides an API response decorator for forbidden access.
 * This is typically used when a user tries to access a resource or perform an action
 * for which they don't have the required authority.
 *
 * @param {AuthoritiesDto} authority - The specific authority required to access the resource or perform the action.
 * @returns {Function} An ApiResponse decorator configured for forbidden access.
 */
export const ApiAuthForbiddenResponse = (authority: AuthoritiesDto) =>
  ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: `The user doesn't have the required \`${authority}}\` authority to perform this operation.`,
    schema: buildErrorResponseSchema({
      message: { example: 'Forbidden resource' },
    }),
  });
