import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

/**
 * Decorator to describe the API property for filtering libraries based on their names.
 *
 * @remarks
 * This decorator is designed to annotate and document the library name filter parameter for library queries.
 * The library name filter is a string that can be used to filter libraries by name. This decorator provides
 * metadata for the API using the NestJS Swagger package, emphasizing the filter's purpose.
 * Additionally, the decorator is designed to be extensible, allowing further customization of the API property
 * by providing optional parameters.
 *
 * @param options - Optional customization for the API property.
 * @returns A decorator function from the `@nestjs/swagger` package with predefined values related to library name filtering, merged with any provided options.
 */
export const ApiLibraryNameFilterProperty = (options?: ApiPropertyOptions) =>
  ApiProperty({
    description: 'A string used for filtering the libraries by name.',
    required: false,
    ...options,
  });
