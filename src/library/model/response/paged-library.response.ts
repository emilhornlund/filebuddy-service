import { ApiProperty } from '@nestjs/swagger';

import { IPageDto, PaginationDto } from '../../../app/model/response';
import { LibraryResponse } from './library.response';

/**
 * Response object representing a page of libraries.
 */
export class PagedLibraryResponse implements IPageDto<LibraryResponse> {
  /*
   * Array of results for the current page.
   */
  @ApiProperty({
    type: [LibraryResponse],
    description: 'Array of results',
    required: true,
  })
  results: LibraryResponse[];

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
