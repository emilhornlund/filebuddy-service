import { Module } from '@nestjs/common';

import { FileController } from '../controller';
import { FileService } from '../service';

@Module({
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
