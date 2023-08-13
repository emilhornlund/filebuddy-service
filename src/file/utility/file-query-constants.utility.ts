import { FileSortDirection, FileSortOrder } from '../model/enum';

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

/** The default sorting order for files if not specified */
export const FILE_QUERY_DEFAULT_FILE_SORT_ORDER: FileSortOrder =
  FileSortOrder.CREATED_AT;

/** The default sorting direction for files if not specified */
export const FILE_QUERY_DEFAULT_FILE_SORT_DIRECTION: FileSortDirection =
  FileSortDirection.DESC;
