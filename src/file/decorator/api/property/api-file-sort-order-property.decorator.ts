import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

import { FileSortOrder } from '../../../model/enum';
import { FILE_QUERY_DEFAULT_FILE_SORT_ORDER } from '../../../utility/file-query-constants.utility';

/**
 * Decorator to describe the API property for the sort order of a file query.
 *
 * @remarks
 * This decorator is employed to annotate and document the sorting criteria of file queries, specifically
 * the field to be used for sorting the files. It provides metadata for the API using the NestJS Swagger package,
 * indicating both the possible values (through an enum) and the default sorting field.
 *
 * @param options - Optional customization for the API property.
 * @returns A decorator function from the `@nestjs/swagger` package with predefined values related to file sorting order.
 */
export const ApiFileSortOrderProperty = (options?: ApiPropertyOptions) =>
  ApiProperty({
    description: 'The field to be used for sorting the files',
    enum: FileSortOrder,
    default: FILE_QUERY_DEFAULT_FILE_SORT_ORDER,
    required: false,
    ...options,
  });
