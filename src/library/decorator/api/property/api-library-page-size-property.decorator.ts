import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

import {
  LIBRARY_QUERY_DEFAULT_PAGE_SIZE,
  LIBRARY_QUERY_MAXIMUM_PAGE_SIZE,
  LIBRARY_QUERY_MINIMUM_PAGE_SIZE,
} from '../../../utility/library-query-constants.utility';

/**
 * Decorator to describe the API property for the size of a library query page.
 *
 * @remarks
 * This decorator is used to annotate and document the pagination aspect of library queries, specifically
 * the number of libraries to be retrieved per page. It offers metadata for the API using the NestJS Swagger package.
 *
 * @param options - Optional customization for the API property.
 * @returns A decorator function from the `@nestjs/swagger` package with predefined values related to page size.
 */
export const ApiLibraryPageSizeProperty = (options?: ApiPropertyOptions) =>
  ApiProperty({
    description: 'The number of libraries to be retrieved per page.',
    type: Number,
    default: LIBRARY_QUERY_DEFAULT_PAGE_SIZE,
    minimum: LIBRARY_QUERY_MINIMUM_PAGE_SIZE,
    maximum: LIBRARY_QUERY_MAXIMUM_PAGE_SIZE,
    required: false,
    ...options,
  });
