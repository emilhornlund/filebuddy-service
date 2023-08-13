import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

/**
 * A decorator that specifies a Swagger property for a file's size.
 *
 * @param options - Additional or override options for the Swagger API property.
 * @returns A Swagger API property decorator configured for file size validation.
 */
export const ApiFileSizeProperty = (options?: ApiPropertyOptions) =>
  ApiProperty({
    title: 'Size',
    description: 'The size of the file in bytes.',
    type: Number,
    required: true,
    minimum: 0,
    example: 32,
    ...options,
  });
