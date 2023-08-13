import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

import { FileSortDirection } from '../../../model/enum';
import { FILE_QUERY_DEFAULT_FILE_SORT_DIRECTION } from '../../../utility/file-query-constants.utility';

/**
 * Decorator to describe the API property for the sort direction of a file query.
 *
 * @remarks
 * This decorator is utilized to annotate and document the sorting direction of file queries, specifying
 * whether the sorting should be in ascending or descending order. It provides metadata for the API using
 * the NestJS Swagger package, indicating both the possible sorting directions (through an enum) and the default direction.
 *
 * @param options - Optional customization for the API property.
 * @returns A decorator function from the `@nestjs/swagger` package with predefined values related to file sorting direction.
 */
export const ApiFileSortDirectionProperty = (options?: ApiPropertyOptions) =>
  ApiProperty({
    description: 'The direction to be used for sorting the files',
    enum: FileSortDirection,
    default: FILE_QUERY_DEFAULT_FILE_SORT_DIRECTION,
    required: false,
    ...options,
  });
