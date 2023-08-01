import { ApiProperty } from '@nestjs/swagger';

/**
 * Data transfer object for pagination data.
 */
export class PaginationDto {
  /**
   * The number of the current page.
   * @ApiProperty Decorator that adds metadata for Swagger API.
   */
  @ApiProperty({
    description: 'The number of the current page.',
    required: true,
  })
  number: number;

  /**
   * The number of elements per page.
   * @ApiProperty Decorator that adds metadata for Swagger API.
   */
  @ApiProperty({
    description: 'The number of elements per page.',
    required: true,
  })
  size: number;

  /**
   * The total number of elements across all pages.
   * @ApiProperty Decorator that adds metadata for Swagger API.
   */
  @ApiProperty({
    description: 'The total number of elements across all pages.',
    required: true,
  })
  totalElements: number;

  /**
   * The total number of pages.
   * @ApiProperty Decorator that adds metadata for Swagger API.
   */
  @ApiProperty({ description: 'The total number of pages.', required: true })
  totalPages: number;
}
