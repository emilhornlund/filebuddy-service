import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PathNotUniqueException } from '../exception';
import { LibraryDto, LibraryEntity } from '../model';

/**
 * A service that handles library-related operations.
 * @Injectable
 */
@Injectable()
export class LibraryService {
  /**
   * Constructs the LibraryService. Automatically injects file repository.
   * @param librariesRepository - The repository for interacting with the libraries data store.
   */
  constructor(
    @InjectRepository(LibraryEntity)
    private librariesRepository: Repository<LibraryEntity>,
  ) {}

  /**
   * Creates a new library entry in the data store.
   * Ensures that the provided library path is unique before creation.
   *
   * @param name - The name of the library.
   * @param path - The path where the library resides. Must be unique.
   * @returns - A promise that resolves with the created LibraryDto.
   * @throws {PathNotUniqueException} - If a library with the same path already exists.
   */
  public async createLibrary(name: string, path: string): Promise<LibraryDto> {
    const libraryExists = await this.librariesRepository.exist({
      where: { path },
    });
    if (libraryExists) {
      throw new PathNotUniqueException(path);
    }

    const libraryEntity = this.librariesRepository.create();
    libraryEntity.name = name;
    libraryEntity.path = path;

    return await this.librariesRepository
      .save(libraryEntity)
      .then(LibraryService.toLibraryDto);
  }

  /**
   * Converts a LibraryEntity object into a LibraryDto object.
   * @param libraryEntity - The LibraryEntity object to convert.
   * @returns - The converted LibraryDto object.
   */
  private static toLibraryDto(libraryEntity: LibraryEntity): LibraryDto {
    const { id, name, path, createdAt, updatedAt } = libraryEntity;
    return {
      id,
      name,
      path,
      createdAt,
      updatedAt,
    };
  }
}
