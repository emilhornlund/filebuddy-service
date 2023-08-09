import { ApiProperty } from '@nestjs/swagger';

import { IPageDto, PaginationDto } from '../../app';
import { LibraryDto } from './library.dto';

/**
 * Data Transfer Object representing a page of libraries.
 */
export class LibraryPageDto implements IPageDto<LibraryDto> {
  /*
   * Array of results for the current page.
   */
  @ApiProperty({
    type: [LibraryDto],
    description: 'Array of results',
    required: true,
  })
  results: LibraryDto[];

  /*
   * Pagination details for the current page.
   */
  @ApiProperty({
    type: PaginationDto,
    description: 'Pagination data',
    required: true,
  })
  page: PaginationDto;
}
