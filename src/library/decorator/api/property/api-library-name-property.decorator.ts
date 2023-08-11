import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

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
