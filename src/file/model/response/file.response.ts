import {
  ApiFileCreatedAtProperty,
  ApiFileIdProperty,
  ApiFileNameProperty,
  ApiFileSizeProperty,
  ApiFileTypeProperty,
  ApiFileUpdatedAtProperty,
} from '../../decorator/api/property';

/**
 * Response object representing a file.
 */
export class FileResponse {
  @ApiFileIdProperty()
  id: string;

  @ApiFileNameProperty()
  name: string;

  @ApiFileTypeProperty()
  type: string;

  @ApiFileSizeProperty()
  size: number;

  @ApiFileCreatedAtProperty()
  createdAt: Date;

  @ApiFileUpdatedAtProperty()
  updatedAt: Date;
}
