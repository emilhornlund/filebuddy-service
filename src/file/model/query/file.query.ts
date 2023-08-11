import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export const ParseIntProperty = (): PropertyDecorator =>
  Transform(({ value }) => parseInt(value, 10));

/** The minimum allowed page number */
export const FILE_QUERY_MINIMUM_PAGE_NUMBER: number = 0;
/** The default page number if not specified */
export const FILE_QUERY_DEFAULT_PAGE: number = FILE_QUERY_MINIMUM_PAGE_NUMBER;
/** The minimum allowed number of files per page */
export const FILE_QUERY_MINIMUM_PAGE_SIZE: number = 10;
/** The maximum allowed number of files per page */
export const FILE_QUERY_MAXIMUM_PAGE_SIZE: number = 50;
/** The default number of files per page if not specified */
export const FILE_QUERY_DEFAULT_PAGE_SIZE: number =
  FILE_QUERY_MINIMUM_PAGE_SIZE;

/** Enum representing possible sorting orders for files */
export enum FileSortOrder {
  NAME = 'NAME',
  SIZE = 'SIZE',
  CREATED_AT = 'CREATED_AT',
  UPDATED_AT = 'UPDATED_AT',
}

/** The default sorting order for files if not specified */
export const FILE_QUERY_DEFAULT_FILE_SORT_ORDER: FileSortOrder =
  FileSortOrder.CREATED_AT;

/** Enum representing possible sorting directions for files */
export enum FileSortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

/** The default sorting direction for files if not specified */
export const FILE_QUERY_DEFAULT_FILE_SORT_DIRECTION: FileSortDirection =
  FileSortDirection.DESC;

/** Class representing a file query, which includes pagination and sorting options */
export class FileQuery {
  /**
   * Represents the page number to fetch. It defaults to FILE_QUERY_DEFAULT_PAGE if not specified.
   */
  @ApiProperty({
    description: 'The number of the page to be retrieved',
    type: Number,
    default: FILE_QUERY_DEFAULT_PAGE,
    minimum: FILE_QUERY_MINIMUM_PAGE_NUMBER,
    required: false,
  })
  @IsInt()
  @Min(FILE_QUERY_MINIMUM_PAGE_NUMBER)
  @IsOptional()
  @ParseIntProperty()
  page: number = FILE_QUERY_DEFAULT_PAGE;

  /**
   * Represents the size of the page (i.e., the number of files per page). It defaults to FILE_QUERY_DEFAULT_PAGE_SIZE if not specified.
   */
  @ApiProperty({
    description: 'The number of files to be retrieved per page',
    type: Number,
    default: FILE_QUERY_DEFAULT_PAGE_SIZE,
    minimum: FILE_QUERY_MINIMUM_PAGE_SIZE,
    maximum: FILE_QUERY_MAXIMUM_PAGE_SIZE,
    required: false,
  })
  @IsInt()
  @Min(FILE_QUERY_MINIMUM_PAGE_SIZE)
  @Max(FILE_QUERY_MAXIMUM_PAGE_SIZE)
  @IsOptional()
  @ParseIntProperty()
  size: number = FILE_QUERY_DEFAULT_PAGE_SIZE;

  /**
   * Represents the field by which to sort the files. It defaults to FILE_QUERY_DEFAULT_FILE_SORT_ORDER if not specified.
   */
  @ApiProperty({
    description: 'The field to be used for sorting the files',
    enum: FileSortOrder,
    default: FILE_QUERY_DEFAULT_FILE_SORT_ORDER,
    required: false,
  })
  @IsEnum(FileSortOrder)
  @IsOptional()
  order: FileSortOrder = FILE_QUERY_DEFAULT_FILE_SORT_ORDER;

  /**
   * Represents the direction of the sort (ascending or descending). It defaults to FILE_QUERY_DEFAULT_FILE_SORT_DIRECTION if not specified.
   */
  @ApiProperty({
    description: 'The direction to be used for sorting the files',
    enum: FileSortDirection,
    default: FILE_QUERY_DEFAULT_FILE_SORT_DIRECTION,
    required: false,
  })
  @IsEnum(FileSortDirection)
  @IsOptional()
  direction: FileSortDirection = FILE_QUERY_DEFAULT_FILE_SORT_DIRECTION;

  /**
   * Represents the string to use for filtering files by name. It is optional and defaults to undefined.
   */
  @ApiProperty({
    description: 'A string used for filtering the files by name',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;
}
