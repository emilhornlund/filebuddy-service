import {
  IsOptionalPageNumber,
  IsOptionalPageSize,
  IsOptionalSortDirection,
} from '../../../app/decorator/validation';
import { SortDirection } from '../../../app/model/response/enum';
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
} from '../../../app/utility/page-constants.utility';
import { DEFAULT_SORT_DIRECTION } from '../../../app/utility/sort-constants.utility';
import { TransformIntProperty } from '../../../app/utility/transform-int-property.utility';
import {
  ApiLibraryNameFilterProperty,
  ApiLibraryPageNumberProperty,
  ApiLibraryPageSizeProperty,
  ApiLibrarySortDirectionProperty,
  ApiLibrarySortOrderProperty,
} from '../../decorator/api/property';
import { IsOptionalName } from '../../decorator/validation/is-optional-name.decorator';
import { IsOptionalSortOrder } from '../../decorator/validation/is-optional-sort-order.decorator';
import { LIBRARY_DEFAULT_SORT_ORDER } from '../../utility/library-sort-constants.utility';
import { LibrarySortOrder } from '../enum';

/** Class representing a library query, which includes pagination and sorting options */
export class LibraryQuery {
  /**
   * Represents the page number to fetch. It defaults to `DEFAULT_PAGE_NUMBER` if not specified.
   */
  @ApiLibraryPageNumberProperty()
  @IsOptionalPageNumber()
  @TransformIntProperty()
  page: number = DEFAULT_PAGE_NUMBER;

  /**
   * Represents the size of the page (i.e., the number of libraries per page). It defaults to `DEFAULT_PAGE_SIZE` if not specified.
   */
  @ApiLibraryPageSizeProperty()
  @IsOptionalPageSize()
  @TransformIntProperty()
  size: number = DEFAULT_PAGE_SIZE;

  /**
   * Represents the field by which to sort the libraries. It defaults to `LIBRARY_DEFAULT_SORT_ORDER` if not specified.
   */
  @ApiLibrarySortOrderProperty()
  @IsOptionalSortOrder()
  order: LibrarySortOrder = LIBRARY_DEFAULT_SORT_ORDER;

  /**
   * Represents the direction of the sort (ascending or descending). It defaults to `DEFAULT_SORT_DIRECTION` if not specified.
   */
  @ApiLibrarySortDirectionProperty()
  @IsOptionalSortDirection()
  direction: SortDirection = DEFAULT_SORT_DIRECTION;

  /**
   * Represents the string to use for filtering libraries by name. It is optional and defaults to undefined.
   */
  @ApiLibraryNameFilterProperty()
  @IsOptionalName()
  name?: string;
}
