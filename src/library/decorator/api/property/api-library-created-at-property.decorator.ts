import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

export const ApiLibraryCreatedAtProperty = (options?: ApiPropertyOptions) =>
  ApiProperty({
    name: 'created_at',
    title: 'Created At',
    description: 'The date and time when the library was created.',
    type: Date,
    required: true,
    ...options,
  });
