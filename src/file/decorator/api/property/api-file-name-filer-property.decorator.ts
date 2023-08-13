import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

/**
 * Decorator to describe the API property for filtering files based on their names.
 *
 * @remarks
 * This decorator is designed to annotate and document the filename filter parameter for file queries.
 * The filename filter is a string that can be used to filter files by name. This decorator provides
 * metadata for the API using the NestJS Swagger package, emphasizing the filter's purpose.
 * Additionally, the decorator is designed to be extensible, allowing further customization of the API property
 * by providing optional parameters.
 *
 * @param options - Optional customization for the API property.
 * @returns A decorator function from the `@nestjs/swagger` package with predefined values related to file name filtering, merged with any provided options.
 */
export const ApiFileNameFilterProperty = (options?: ApiPropertyOptions) =>
  ApiProperty({
    description: 'A string used for filtering the files by name',
    required: false,
    ...options,
  });
