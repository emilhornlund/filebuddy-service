import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

import {
  DEFAULT_PAGE_NUMBER,
  MAXIMUM_PAGE_NUMBER,
  MINIMUM_PAGE_NUMBER,
} from '../../../../app/utility/page-constants.utility';

/**
 * Decorator to describe the API property for a library query page.
 *
 * @remarks
 * This decorator is utilized to annotate and document the pagination aspect of library queries, specifically
 * for the page number. It provides metadata for the API using the NestJS Swagger package.
 *
 * @param options - Optional customization for the API property.
 * @returns A decorator function from the `@nestjs/swagger` package with predefined values.
 */
export const ApiLibraryPageNumberProperty = (options?: ApiPropertyOptions) =>
  ApiProperty({
    description: 'The number of the page to be retrieved.',
    type: Number,
    default: DEFAULT_PAGE_NUMBER,
    minimum: MINIMUM_PAGE_NUMBER,
    maximum: MAXIMUM_PAGE_NUMBER,
    required: false,
    ...options,
  });
