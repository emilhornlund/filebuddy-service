import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Exception that gets thrown when a library could not be found.
 */
export class LibraryNotFoundException extends HttpException {
  /**
   * Constructs the exception.
   * @param libraryId - The ID of the library that could not be found.
   */
  constructor(libraryId: string) {
    super(`Library was not found by id \`${libraryId}\``, HttpStatus.NOT_FOUND);
  }
}
