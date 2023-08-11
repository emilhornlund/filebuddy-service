import { HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { buildErrorResponseSchema } from '../../../utility';

export const ApiLibraryUnauthorizedResponse = () =>
  ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Authentication failed. This usually happens if no bearer token is provided or if the provided token is invalid.',
    schema: buildErrorResponseSchema({ message: { example: 'Unauthorized' } }),
  });
