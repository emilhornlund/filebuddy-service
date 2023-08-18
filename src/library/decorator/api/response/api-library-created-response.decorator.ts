import { HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { LibraryResponse } from '../../../model/response';

/**
 * Provides an API response decorator for successful library creation.
 *
 * Indicates that the library was successfully created in the system.
 *
 * @returns {Function} An ApiResponse decorator configured for successful library creation.
 */
export const ApiLibraryCreatedResponse = () =>
  ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The library was successfully created.',
    type: () => LibraryResponse,
  });
