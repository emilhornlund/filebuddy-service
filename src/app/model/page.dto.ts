import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { PaginationDto } from './pagination.dto';

/**
 * Interface for the generic page DTO.
 */
export interface IPageDto<T> {
  /** Array of results for the current page. */
  results: T[];

  /** Pagination details for the current page. */
  page: PaginationDto;
}

/**
 * Function to create a new PageDto with a given type.
 * @param classRef - The class reference to use as the type for the PageDto.
 * @returns A new PageDto with the provided type.
 */
export function PageDto<T>(classRef: Type<T>): new () => IPageDto<T> {
  class PageDtoInternal {
    @ApiProperty({
      type: [classRef],
      description: 'Array of results',
      required: true,
    })
    results: T[];

    @ApiProperty({
      type: PaginationDto,
      description: 'Pagination data',
      required: true,
    })
    page: PaginationDto;
  }

  return PageDtoInternal as new () => IPageDto<T>;
}
