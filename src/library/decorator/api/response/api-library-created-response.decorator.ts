import { HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { LibraryResponse } from '../../../model/response';

export const ApiLibraryCreatedResponse = () =>
  ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The library was successfully created.',
    type: () => LibraryResponse,
  });
