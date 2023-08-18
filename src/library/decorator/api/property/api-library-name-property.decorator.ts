import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

/**
 * Provides an API property decorator to describe the name of a library.
 *
 * @param {ApiPropertyOptions} [options] - Optional additional property configurations.
 * @returns {Function} An ApiProperty decorator configured for the library's name.
 */
export const ApiLibraryNameProperty = (options?: ApiPropertyOptions) =>
  ApiProperty({
    title: 'Name',
    description:
      'The name of the library. It should contain only alphanumeric characters, periods, dashes, underscores, and spaces.',
    type: String,
    required: true,
    minLength: 2,
    maxLength: 20,
    pattern: '^[a-zA-Z0-9.-_ ]+$',
    example: 'Test Library',
    ...options,
  });
