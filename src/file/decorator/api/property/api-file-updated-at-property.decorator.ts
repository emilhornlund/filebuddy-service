import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

/**
 * A decorator that specifies a Swagger property for a file's update timestamp.
 *
 * @param options - Additional or override options for the Swagger API property.
 * @returns A Swagger API property decorator configured for file update timestamp.
 */
export const ApiFileUpdatedAtProperty = (options?: ApiPropertyOptions) =>
  ApiProperty({
    name: 'updated_at',
    title: 'Updated At',
    description: 'The date and time when the file was last updated.',
    type: Date,
    required: true,
    ...options,
  });
