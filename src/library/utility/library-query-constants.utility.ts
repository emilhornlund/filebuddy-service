import { LibrarySortDirection, LibrarySortOrder } from '../model/enum';

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

/** The default sorting order for libraries if not specified */
export const LIBRARY_QUERY_DEFAULT_SORT_ORDER: LibrarySortOrder =
  LibrarySortOrder.CREATED_AT;

/** The default sorting direction for libraries if not specified */
export const LIBRARY_QUERY_DEFAULT_SORT_DIRECTION: LibrarySortDirection =
  LibrarySortDirection.DESC;
