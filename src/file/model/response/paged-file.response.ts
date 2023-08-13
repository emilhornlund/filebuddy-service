import { ApiProperty } from '@nestjs/swagger';

import { IPageDto, PaginationDto } from '../../../app/model/response';
import { FileResponse } from './file.response';

/**
 * Response object representing a page of files.
 */
export class PagedFileResponse implements IPageDto<FileResponse> {
  /** Array of results for the current page. */
  @ApiProperty({
    type: [FileResponse],
    description: 'Array of results',
    required: true,
  })
  results: FileResponse[];

  /** Pagination details for the current page. */
  @ApiProperty({
    type: PaginationDto,
    description: 'Pagination data',
    required: true,
  })
  page: PaginationDto;
}
