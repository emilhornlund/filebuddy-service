import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

/**
 * Provides an API property decorator to describe the creation timestamp of a library.
 *
 * @param {ApiPropertyOptions} [options] - Optional additional property configurations.
 * @returns {Function} An ApiProperty decorator configured for the library's creation timestamp.
 */
export const ApiLibraryCreatedAtProperty = (options?: ApiPropertyOptions) =>
  ApiProperty({
    name: 'created_at',
    title: 'Created At',
    description: 'The date and time when the library was created.',
    type: Date,
    required: true,
    ...options,
  });
