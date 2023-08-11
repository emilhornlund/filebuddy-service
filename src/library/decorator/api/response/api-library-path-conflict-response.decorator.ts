import { HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { buildErrorResponseSchema } from '../../../utility';

export const ApiLibraryPathConflictResponse = () =>
  ApiResponse({
    status: HttpStatus.CONFLICT,
    description:
      'The provided library path is not unique. A library with the same path already exists in the system.',
    schema: buildErrorResponseSchema({
      message: { example: 'Path `/absolute/path/to/library` was not unique.' },
    }),
  });
