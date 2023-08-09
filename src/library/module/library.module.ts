import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LibraryController } from '../controller';
import { LibraryEntity } from '../model';
import { LibraryService } from '../service';

@Module({
  imports: [TypeOrmModule.forFeature([LibraryEntity])],
  controllers: [LibraryController],
  providers: [LibraryService],
})
export class LibraryModule {}
