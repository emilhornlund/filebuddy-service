import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Exception that gets thrown when a file could not be found.
 */
export class FileNotFoundException extends HttpException {
  /**
   * Constructs the exception.
   * @param fileId - The ID of the file that could not be found.
   */
  constructor(fileId: string) {
    super(`File was not found by id \`${fileId}\``, HttpStatus.NOT_FOUND);
  }
}
