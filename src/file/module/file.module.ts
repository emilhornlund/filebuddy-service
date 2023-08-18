import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FileController } from '../controller';
import { FileEntity } from '../model/entity';
import { FileService } from '../service';

/**
 * Module for the file management feature.
 *
 * This module sets up dependency injection for file-related operations,
 * integrating with the TypeORM for database interactions, registering the `FileController`,
 * and setting up the `FileService` as a provider.
 */
@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
