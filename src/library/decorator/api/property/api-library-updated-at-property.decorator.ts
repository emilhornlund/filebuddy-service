import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

export const ApiLibraryUpdatedAtProperty = (options?: ApiPropertyOptions) =>
  ApiProperty({
    name: 'updated_at',
    title: 'Updated At',
    description: 'The date and time when the library was last updated.',
    type: Date,
    required: true,
    ...options,
  });
