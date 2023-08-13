import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { TransformIntProperty } from '../../../app/utility/transform-int-property.utility';
import {
  ApiFileNameFilterProperty,
  ApiFilePageNumberProperty,
  ApiFilePageSizeProperty,
  ApiFileSortDirectionProperty,
  ApiFileSortOrderProperty,
} from '../../decorator/api/property';
import {
  FILE_QUERY_DEFAULT_FILE_SORT_DIRECTION,
  FILE_QUERY_DEFAULT_FILE_SORT_ORDER,
  FILE_QUERY_DEFAULT_PAGE,
  FILE_QUERY_DEFAULT_PAGE_SIZE,
  FILE_QUERY_MAXIMUM_PAGE_SIZE,
  FILE_QUERY_MINIMUM_PAGE_NUMBER,
  FILE_QUERY_MINIMUM_PAGE_SIZE,
} from '../../utility/file-query-constants.utility';
import { FileSortDirection, FileSortOrder } from '../enum';

/** Class representing a file query, which includes pagination and sorting options */
export class FileQuery {
  /**
   * Represents the page number to fetch. It defaults to `FILE_QUERY_DEFAULT_PAGE` if not specified.
   */
  @ApiFilePageNumberProperty()
  @IsInt()
  @Min(FILE_QUERY_MINIMUM_PAGE_NUMBER)
  @IsOptional()
  @TransformIntProperty()
  page: number = FILE_QUERY_DEFAULT_PAGE;

  /**
   * Represents the size of the page (i.e., the number of files per page). It defaults to `FILE_QUERY_DEFAULT_PAGE_SIZE` if not specified.
   */
  @ApiFilePageSizeProperty()
  @IsInt()
  @Min(FILE_QUERY_MINIMUM_PAGE_SIZE)
  @Max(FILE_QUERY_MAXIMUM_PAGE_SIZE)
  @IsOptional()
  @TransformIntProperty()
  size: number = FILE_QUERY_DEFAULT_PAGE_SIZE;

  /**
   * Represents the field by which to sort the files. It defaults to `FILE_QUERY_DEFAULT_FILE_SORT_ORDER` if not specified.
   */
  @ApiFileSortOrderProperty()
  @IsEnum(FileSortOrder)
  @IsOptional()
  order: FileSortOrder = FILE_QUERY_DEFAULT_FILE_SORT_ORDER;

  /**
   * Represents the direction of the sort (ascending or descending). It defaults to `FILE_QUERY_DEFAULT_FILE_SORT_DIRECTION` if not specified.
   */
  @ApiFileSortDirectionProperty()
  @IsEnum(FileSortDirection)
  @IsOptional()
  direction: FileSortDirection = FILE_QUERY_DEFAULT_FILE_SORT_DIRECTION;

  /**
   * Represents the string to use for filtering files by name. It is optional and defaults to undefined.
   */
  @ApiFileNameFilterProperty()
  @IsString()
  @IsOptional()
  name?: string;
}
