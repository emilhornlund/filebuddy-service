import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LibraryController } from '../controller';
import { LibraryEntity } from '../model/entity';
import { LibraryService } from '../service';

/**
 * Module for the library feature.
 *
 * This module sets up dependency injection for the library feature by importing necessary modules,
 * defining controllers and providers.
 */
@Module({
  imports: [TypeOrmModule.forFeature([LibraryEntity])],
  controllers: [LibraryController],
  providers: [LibraryService],
})
export class LibraryModule {}
