import { ApiProperty } from '@nestjs/swagger';

/**
 * A DTO for files, including properties for identification, name, size, and timestamps.
 */
export class FileDto {
  @ApiProperty({
    description: 'Unique identifier for the file',
    required: true,
  })
  id: string;

  @ApiProperty({ description: 'Name of the file', required: true })
  name: string;

  @ApiProperty({ description: 'Size of the file', required: true })
  size: number;

  @ApiProperty({
    description: 'The date and time the file was created',
    required: true,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time the file was last updated',
    required: true,
  })
  updatedAt: Date;
}
