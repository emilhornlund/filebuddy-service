import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

import { SortDirection } from '../../../../app/model/response/enum';
import { DEFAULT_SORT_DIRECTION } from '../../../../app/utility/sort-constants.utility';

/**
 * Decorator to describe the API property for the sort direction of a library query.
 *
 * @remarks
 * This decorator is utilized to annotate and document the sorting direction of library queries, specifying
 * whether the sorting should be in ascending or descending order. It provides metadata for the API using
 * the NestJS Swagger package, indicating both the possible sorting directions (through an enum) and the default direction.
 *
 * @param options - Optional customization for the API property.
 * @returns A decorator function from the `@nestjs/swagger` package with predefined values related to library sorting direction.
 */
export const ApiLibrarySortDirectionProperty = (options?: ApiPropertyOptions) =>
  ApiProperty({
    description: 'The direction to be used for sorting the libraries.',
    enum: SortDirection,
    default: DEFAULT_SORT_DIRECTION,
    required: false,
    ...options,
  });
