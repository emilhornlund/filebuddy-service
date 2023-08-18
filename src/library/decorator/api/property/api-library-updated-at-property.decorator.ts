import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

/**
 * Provides an API property decorator to describe the last updated timestamp of a library.
 *
 * @param {ApiPropertyOptions} [options] - Optional additional property configurations.
 * @returns {Function} An ApiProperty decorator configured for the library's updated timestamp.
 */
export const ApiLibraryUpdatedAtProperty = (options?: ApiPropertyOptions) =>
  ApiProperty({
    name: 'updated_at',
    title: 'Updated At',
    description: 'The date and time when the library was last updated.',
    type: Date,
    required: true,
    ...options,
  });
