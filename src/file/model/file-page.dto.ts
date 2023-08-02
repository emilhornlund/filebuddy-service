import { ApiProperty } from '@nestjs/swagger';

import { IPageDto, PaginationDto } from '../../app';
import { FileDto } from './file.dto';

/**
 * A DTO for pages that contain FileDto results.
 */
export class FilePageDto implements IPageDto<FileDto> {
  /** Array of results for the current page. */
  @ApiProperty({
    type: [FileDto],
    description: 'Array of results',
    required: true,
  })
  results: FileDto[];

  /** Pagination details for the current page. */
  @ApiProperty({
    type: PaginationDto,
    description: 'Pagination data',
    required: true,
  })
  page: PaginationDto;
}
