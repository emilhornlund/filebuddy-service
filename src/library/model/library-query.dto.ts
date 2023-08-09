import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

const ParseIntProperty = (): PropertyDecorator =>
  Transform(({ value }) => parseInt(value, 10));

/** The minimum allowed page number */
export const LIBRARY_QUERY_MINIMUM_PAGE_NUMBER: number = 0;
/** The default page number if not specified */
export const LIBRARY_QUERY_DEFAULT_PAGE: number =
  LIBRARY_QUERY_MINIMUM_PAGE_NUMBER;
/** The minimum allowed number of libraries per page */
export const LIBRARY_QUERY_MINIMUM_PAGE_SIZE: number = 10;
/** The maximum allowed number of libraries per page */
export const LIBRARY_QUERY_MAXIMUM_PAGE_SIZE: number = 50;
/** The default number of libraries per page if not specified */
export const LIBRARY_QUERY_DEFAULT_PAGE_SIZE: number =
  LIBRARY_QUERY_MINIMUM_PAGE_SIZE;

/** Enum representing possible sorting orders for libraries */
export enum LibrarySortOrder {
  NAME = 'NAME',
  CREATED_AT = 'CREATED_AT',
  UPDATED_AT = 'UPDATED_AT',
}

/** The default sorting order for libraries if not specified */
export const LIBRARY_QUERY_DEFAULT_SORT_ORDER: LibrarySortOrder =
  LibrarySortOrder.CREATED_AT;

/** Enum representing possible sorting directions for libraries */
export enum LibrarySortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

/** The default sorting direction for libraries if not specified */
export const LIBRARY_QUERY_DEFAULT_SORT_DIRECTION: LibrarySortDirection =
  LibrarySortDirection.DESC;

/** Class representing a library query, which includes pagination and sorting options */
export class LibraryQueryDto {
  /**
   * Represents the page number to fetch. It defaults to LIBRARY_QUERY_DEFAULT_PAGE if not specified.
   */
  @ApiProperty({
    description: 'The number of the page to be retrieved',
    type: Number,
    default: LIBRARY_QUERY_DEFAULT_PAGE,
    minimum: LIBRARY_QUERY_MINIMUM_PAGE_NUMBER,
    required: false,
  })
  @IsInt()
  @Min(LIBRARY_QUERY_MINIMUM_PAGE_NUMBER)
  @IsOptional()
  @ParseIntProperty()
  page: number = LIBRARY_QUERY_DEFAULT_PAGE;

  /**
   * Represents the size of the page (i.e., the number of libraries per page). It defaults to LIBRARY_QUERY_DEFAULT_PAGE_SIZE if not specified.
   */
  @ApiProperty({
    description: 'The number of libraries to be retrieved per page',
    type: Number,
    default: LIBRARY_QUERY_DEFAULT_PAGE_SIZE,
    minimum: LIBRARY_QUERY_MINIMUM_PAGE_SIZE,
    maximum: LIBRARY_QUERY_MAXIMUM_PAGE_SIZE,
    required: false,
  })
  @IsInt()
  @Min(LIBRARY_QUERY_MINIMUM_PAGE_SIZE)
  @Max(LIBRARY_QUERY_MAXIMUM_PAGE_SIZE)
  @IsOptional()
  @ParseIntProperty()
  size: number = LIBRARY_QUERY_DEFAULT_PAGE_SIZE;

  /**
   * Represents the field by which to sort the libraries. It defaults to LIBRARY_QUERY_DEFAULT_LIBRARY_SORT_ORDER if not specified.
   */
  @ApiProperty({
    description: 'The field to be used for sorting the libraries',
    enum: LibrarySortOrder,
    default: LIBRARY_QUERY_DEFAULT_SORT_ORDER,
    required: false,
  })
  @IsEnum(LibrarySortOrder)
  @IsOptional()
  order: LibrarySortOrder = LIBRARY_QUERY_DEFAULT_SORT_ORDER;

  /**
   * Represents the direction of the sort (ascending or descending). It defaults to LIBRARY_QUERY_DEFAULT_LIBRARY_SORT_DIRECTION if not specified.
   */
  @ApiProperty({
    description: 'The direction to be used for sorting the libraries',
    enum: LibrarySortDirection,
    default: LIBRARY_QUERY_DEFAULT_SORT_DIRECTION,
    required: false,
  })
  @IsEnum(LibrarySortDirection)
  @IsOptional()
  direction: LibrarySortDirection = LIBRARY_QUERY_DEFAULT_SORT_DIRECTION;

  /**
   * Represents the string to use for filtering libraries by name. It is optional and defaults to undefined.
   */
  @ApiProperty({
    description: 'A string used for filtering the libraries by name',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;
}
