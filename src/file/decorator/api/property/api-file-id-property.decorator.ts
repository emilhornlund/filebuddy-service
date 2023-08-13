import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

/**
 * A decorator that specifies a Swagger property for a file's unique identifier.
 *
 * @param options - Additional or override options for the Swagger API property.
 * @returns A Swagger API property decorator configured for file ID validation.
 */
export const ApiFileIdProperty = (options?: ApiPropertyOptions) =>
  ApiProperty({
    title: 'Id',
    description: 'Unique identifier for the file.',
    type: String,
    format: 'uuid',
    required: true,
    example: uuidv4(),
    ...options,
  });
