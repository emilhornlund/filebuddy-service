import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

/**
 * A decorator for specifying a Swagger property for file MIME types.
 *
 * @param options - Additional or override options for the Swagger API property.
 *
 * @remarks
 * This decorator will enforce a MIME type pattern for properties it decorates.
 * The MIME type is expected to be in the `type/subtype` format, such as `image/jpeg` or `application/pdf`.
 *
 * @example
 * class UploadDto {
 *   @ApiFileTypeProperty()
 *   fileType: string;
 * }
 *
 * @returns A Swagger API property decorator configured for MIME type validation.
 */
export const ApiFileTypeProperty = (options?: ApiPropertyOptions) =>
  ApiProperty({
    title: 'Type',
    description: 'MIME type of the file',
    type: String,
    required: true,
    pattern: '^[a-z]+/[a-z0-9-+]+$',
    example: 'image/jpeg',
    ...options,
  });
