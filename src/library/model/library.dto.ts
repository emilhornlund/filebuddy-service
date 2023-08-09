import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object representing a library.
 */
export class LibraryDto {
  /**
   * Unique identifier for the library.
   */
  @ApiProperty({
    description: 'Unique identifier for the library',
    required: true,
  })
  id: string;

  /**
   * The name of the library.
   */
  @ApiProperty({ description: 'Name of the library', required: true })
  name: string;

  /**
   * The path where the library resides.
   */
  @ApiProperty({
    description: 'Path where the library resides',
    required: true,
  })
  path: string;

  /**
   * The date and time when the library was created.
   */
  @ApiProperty({
    description: 'The date and time the library was created',
    type: Date,
    required: true,
  })
  createdAt: Date;

  /**
   * The date and time when the library was last updated.
   */
  @ApiProperty({
    description: 'The date and time the library was last updated',
    type: Date,
    required: true,
  })
  updatedAt: Date;
}
