import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

/**
 * This class defines a Data Transfer Object (DTO) that provides a structure for incoming data related to file IDs.
 * This object contains one property: 'fileId' which must be a UUID (Universally Unique Identifier).
 * This is primarily used to identify a specific file in requests where a file's ID is required (like retrieval or deletion).
 */
export class FileIdParam {
  /**
   * This is the unique identifier for the file.
   * It's expected to be a UUID (Universally Unique Identifier) which ensures a high degree of uniqueness.
   * This property is often used to identify a specific file for retrieval, modification, or deletion.
   */
  @ApiProperty({
    name: 'FileId',
    description: 'The unique identifier (UUID format) of the file to retrieve',
    type: String,
    format: 'uuid',
    required: true,
  })
  @IsUUID()
  fileId: string;
}
