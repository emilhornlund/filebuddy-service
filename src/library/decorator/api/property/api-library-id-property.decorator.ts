import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

/**
 * Provides an API property decorator to describe the unique identifier of a library.
 *
 * @param {ApiPropertyOptions} [options] - Optional additional property configurations.
 * @returns {Function} An ApiProperty decorator configured for the library's unique ID.
 */
export const ApiLibraryIdProperty = (options?: ApiPropertyOptions) =>
  ApiProperty({
    title: 'Id',
    description: 'Unique identifier for the library.',
    type: String,
    format: 'uuid',
    required: true,
    example: uuidv4(),
    ...options,
  });
