import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

import {
  FILE_QUERY_DEFAULT_PAGE_SIZE,
  FILE_QUERY_MAXIMUM_PAGE_SIZE,
  FILE_QUERY_MINIMUM_PAGE_SIZE,
} from '../../../utility/file-query-constants.utility';

/**
 * Decorator to describe the API property for the size of a file query page.
 *
 * @remarks
 * This decorator is used to annotate and document the pagination aspect of file queries, specifically
 * the number of files to be retrieved per page. It offers metadata for the API using the NestJS Swagger package.
 *
 * @param options - Optional customization for the API property.
 * @returns A decorator function from the `@nestjs/swagger` package with predefined values related to page size.
 */
export const ApiFilePageSizeProperty = (options?: ApiPropertyOptions) =>
  ApiProperty({
    description: 'The number of files to be retrieved per page',
    type: Number,
    default: FILE_QUERY_DEFAULT_PAGE_SIZE,
    minimum: FILE_QUERY_MINIMUM_PAGE_SIZE,
    maximum: FILE_QUERY_MAXIMUM_PAGE_SIZE,
    required: false,
    ...options,
  });
