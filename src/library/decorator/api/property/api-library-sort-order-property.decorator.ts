import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

import { LibrarySortOrder } from '../../../model/enum';
import { LIBRARY_QUERY_DEFAULT_SORT_ORDER } from '../../../utility/library-query-constants.utility';

/**
 * Decorator to describe the API property for the sort order of a library query.
 *
 * @remarks
 * This decorator is employed to annotate and document the sorting criteria of library queries, specifically
 * the field to be used for sorting the libraries. It provides metadata for the API using the NestJS Swagger package,
 * indicating both the possible values (through an enum) and the default sorting field.
 *
 * @param options - Optional customization for the API property.
 * @returns A decorator function from the `@nestjs/swagger` package with predefined values related to library sorting order.
 */
export const ApiLibrarySortOrderProperty = (options?: ApiPropertyOptions) =>
  ApiProperty({
    description: 'The field to be used for sorting the libraries.',
    enum: LibrarySortOrder,
    default: LIBRARY_QUERY_DEFAULT_SORT_ORDER,
    required: false,
    ...options,
  });
