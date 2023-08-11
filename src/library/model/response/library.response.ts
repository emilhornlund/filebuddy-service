import {
  ApiLibraryCreatedAtProperty,
  ApiLibraryIdProperty,
  ApiLibraryNameProperty,
  ApiLibraryPathProperty,
  ApiLibraryUpdatedAtProperty,
} from '../../decorator';

/**
 * Response object representing a library.
 */
export class LibraryResponse {
  /**
   * Unique identifier for the library.
   */
  @ApiLibraryIdProperty()
  id: string;

  /**
   * The name of the library.
   */
  @ApiLibraryNameProperty()
  name: string;

  /**
   * The path where the library resides.
   */
  @ApiLibraryPathProperty()
  path: string;

  /**
   * The date and time when the library was created.
   */
  @ApiLibraryCreatedAtProperty()
  createdAt: Date;

  /**
   * The date and time when the library was last updated.
   */
  @ApiLibraryUpdatedAtProperty()
  updatedAt: Date;
}
