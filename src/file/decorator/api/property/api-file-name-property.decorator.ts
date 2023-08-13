import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

/**
 * A decorator that specifies a Swagger property for a file's name.
 *
 * @param options - Additional or override options for the Swagger API property.
 * @returns A Swagger API property decorator configured for file name validation.
 */
export const ApiFileNameProperty = (options?: ApiPropertyOptions) =>
  ApiProperty({
    title: 'Name',
    description: 'The name of the file, including possible extensions.',
    type: String,
    required: true,
    minLength: 2,
    maxLength: 256,
    pattern: '^[a-zA-Z0-9.-_ ]+$',
    example: 'Example File.jpg',
    ...options,
  });
