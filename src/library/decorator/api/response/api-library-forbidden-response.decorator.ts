import { HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { buildErrorResponseSchema } from '../../../utility';

export const ApiLibraryForbiddenResponse = () =>
  ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      "The user doesn't have the required `LIBRARY_MANAGEMENT` authority to perform this operation.",
    schema: buildErrorResponseSchema({
      message: { example: 'Forbidden resource' },
    }),
  });
