import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

export const ApiLibraryIdProperty = (options?: ApiPropertyOptions) =>
  ApiProperty({
    title: 'Id',
    description: 'Unique identifier for the library.',
    type: String,
    format: 'uuid',
    required: true,
    example: uuidv4(),
    ...options,
  });

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

export const ApiLibraryCreatedAtProperty = (options?: ApiPropertyOptions) =>
  ApiProperty({
    name: 'created_at',
    title: 'Created At',
    description: 'The date and time when the library was created.',
    type: Date,
    required: true,
    ...options,
  });

export const ApiLibraryUpdatedAtProperty = (options?: ApiPropertyOptions) =>
  ApiProperty({
    name: 'updated_at',
    title: 'Updated At',
    description: 'The date and time when the library was last updated.',
    type: Date,
    required: true,
    ...options,
  });
