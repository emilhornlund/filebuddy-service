import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Exception that is thrown when a provided library path is not unique.
 *
 * This exception results in an HTTP 409 Conflict status code being returned.
 */
export class PathNotUniqueException extends HttpException {
  constructor(path: string) {
    super(`Path \`${path}\` was not unique.`, HttpStatus.CONFLICT);
  }
}
