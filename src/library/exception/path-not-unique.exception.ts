import { HttpException, HttpStatus } from '@nestjs/common';

export class PathNotUniqueException extends HttpException {
  constructor(path: string) {
    super(`Path \`${path}\` was not unique.`, HttpStatus.CONFLICT);
  }
}
