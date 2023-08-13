import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

import {
  FILE_QUERY_DEFAULT_PAGE,
  FILE_QUERY_MINIMUM_PAGE_NUMBER,
} from '../../../utility/file-query-constants.utility';

/**
 * Decorator to describe the API property for a file query page.
 *
 * @remarks
 * This decorator is utilized to annotate and document the pagination aspect of file queries, specifically
 * for the page number. It provides metadata for the API using the NestJS Swagger package.
 *
 * @param options - Optional customization for the API property.
 * @returns A decorator function from the `@nestjs/swagger` package with predefined values.
 */
export const ApiFilePageNumberProperty = (options?: ApiPropertyOptions) =>
  ApiProperty({
    description: 'The number of the page to be retrieved',
    type: Number,
    default: FILE_QUERY_DEFAULT_PAGE,
    minimum: FILE_QUERY_MINIMUM_PAGE_NUMBER,
    required: false,
    ...options,
  });
