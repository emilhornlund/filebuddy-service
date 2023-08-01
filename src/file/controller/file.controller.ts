import { Controller } from '@nestjs/common';

import { FileService } from '../service';

@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}
}
