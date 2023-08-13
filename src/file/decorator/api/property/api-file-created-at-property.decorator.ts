import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

/**
 * A decorator that specifies a Swagger property for a file's creation timestamp.
 *
 * @param options - Additional or override options for the Swagger API property.
 * @returns A Swagger API property decorator configured for file creation timestamp.
 */
export const ApiFileCreatedAtProperty = (options?: ApiPropertyOptions) =>
  ApiProperty({
    name: 'created_at',
    title: 'Created At',
    description: 'The date and time when the file was created.',
    type: Date,
    required: true,
    ...options,
  });
