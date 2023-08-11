import {
  ApiLibraryNameProperty,
  ApiLibraryPathProperty,
  IsDirectoryPath,
  IsName,
} from '../../decorator';

/**
 * Request object representing the payload required
 * to create a new library. It includes properties for the
 * library's name and the path where the library resides.
 *
 * @remarks
 * This request object is meant to be used for validating
 * and transporting data when creating a new library.
 *
 * @example
 * const newLibrary: CreateLibraryRequest = {
 *   name: 'MyLibrary',
 *   path: '/path/to/library'
 * };
 */
export class CreateLibraryRequest {
  /**
   * Represents the name of the library.
   * - It should not be empty.
   * - It must contain between 2 and 20 characters.
   * - It can only contain alphanumeric characters, hyphens, underscores, spaces, and dots.
   */
  @ApiLibraryNameProperty()
  @IsName()
  name: string;

  /**
   * Represents the path where the library is located.
   * - It should not be empty.
   * - The path should start with a '/' (root directory).
   * - Allowed characters include alphanumeric characters, spaces, dots, hyphens, and underscores.
   * - Each segment of the path should be separated by a '/'.
   * - The path should not end with a filename and extension.
   */
  @ApiLibraryPathProperty()
  @IsDirectoryPath()
  path: string;
}
