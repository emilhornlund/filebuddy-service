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
