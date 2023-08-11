import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

export const ApiLibraryPathProperty = (options?: ApiPropertyOptions) =>
  ApiProperty({
    title: 'Path',
    description:
      "The absolute path where the library resides. It should start with a '/' and contain only valid directory characters. The path should not end with a filename and extension.",
    type: String,
    required: true,
    pattern: '^/[a-zA-Z0-9.-_ /]+(?<!.[a-zA-Z0-9]{1,10})$',
    example: '/absolute/path/to/library',
    ...options,
  });
