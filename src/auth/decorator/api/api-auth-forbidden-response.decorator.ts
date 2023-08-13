import { HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { buildErrorResponseSchema } from '../../../library/utility';
import { AuthoritiesDto } from '../../model/security';

export const ApiAuthForbiddenResponse = (authority: AuthoritiesDto) =>
  ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: `The user doesn't have the required \`${authority}}\` authority to perform this operation.`,
    schema: buildErrorResponseSchema({
      message: { example: 'Forbidden resource' },
    }),
  });
