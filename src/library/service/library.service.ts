import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Not, Repository } from 'typeorm';

import { toPageDto } from '../../app';
import { LibraryNotFoundException, PathNotUniqueException } from '../exception';
import { LibraryEntity } from '../model/entity';
import {
  LIBRARY_QUERY_DEFAULT_PAGE,
  LIBRARY_QUERY_DEFAULT_PAGE_SIZE,
  LIBRARY_QUERY_DEFAULT_SORT_DIRECTION,
  LIBRARY_QUERY_DEFAULT_SORT_ORDER,
  LibrarySortDirection,
  LibrarySortOrder,
} from '../model/query';
import { LibraryResponse, PagedLibraryResponse } from '../model/response';

/**
 * A service that handles library-related operations.
 * @Injectable
 */
@Injectable()
export class LibraryService {
  /**
   * Constructs the LibraryService. Automatically injects library repository.
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
  public async create(name: string, path: string): Promise<LibraryResponse> {
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
   * Fetches all libraries from the data store and provides pagination and sorting functionality.
   * @param page - The number of the page to fetch. Defaults to `LIBRARY_QUERY_DEFAULT_PAGE`.
   * @param size - The number of items per page. Defaults to `LIBRARY_QUERY_DEFAULT_PAGE_SIZE`.
   * @param order - The field by which to order the results. Defaults to `LIBRARY_QUERY_DEFAULT_SORT_ORDER`.
   * @param direction - The order type (ASC or DESC). Defaults to `LIBRARY_QUERY_DEFAULT_SORT_DIRECTION`.
   * @param nameFilter - Optional name filter to apply to the library names.
   * @returns - A promise that will resolve to a `LibraryPageDto` containing the fetched libraries and page information.
   */
  public async findAll(
    page: number = LIBRARY_QUERY_DEFAULT_PAGE,
    size: number = LIBRARY_QUERY_DEFAULT_PAGE_SIZE,
    order: LibrarySortOrder = LIBRARY_QUERY_DEFAULT_SORT_ORDER,
    direction: LibrarySortDirection = LIBRARY_QUERY_DEFAULT_SORT_DIRECTION,
    nameFilter?: string,
  ): Promise<PagedLibraryResponse> {
    const skip = page * size;

    const orderParams = {};
    orderParams[LibraryService.toEntitySortOrder(order)] = direction;

    const queryCondition = {};
    if (nameFilter) {
      queryCondition['name'] = Like(`%${nameFilter}%`);
    }

    const [results, totalElements] =
      await this.librariesRepository.findAndCount({
        where: queryCondition,
        order: orderParams,
        take: size,
        skip,
      });

    return toPageDto(
      results.map(LibraryService.toLibraryDto),
      page,
      size,
      totalElements,
    );
  }

  /**
   * Fetches a specific library by ID from the data store.
   * @param libraryId - The ID of the library to fetch.
   * @returns - A promise that will resolve to a `LibraryDto` containing the library data.
   * @throws LibraryNotFoundException when a library with the given ID is not found.
   */
  public async findById(libraryId: string): Promise<LibraryResponse> {
    const entity = await this.librariesRepository.findOne({
      where: { id: libraryId },
    });
    if (!entity) {
      throw new LibraryNotFoundException(libraryId);
    }
    return LibraryService.toLibraryDto(entity);
  }

  /**
   * Updates the library details by its ID.
   *
   * @param libraryId - The unique identifier of the library to be updated.
   * @param name - (Optional) The new name for the library. If provided and different from the current, it will update the name.
   * @param path - (Optional) The new path for the library. If provided and different from the current, it will update the path. If a library with the same path already exists (excluding the one being updated), a `PathNotUniqueException` will be thrown.
   *
   * @returns A promise that resolves with the updated `LibraryDto`.
   *
   * @throws {LibraryNotFoundException} - If a library with the provided ID is not found.
   * @throws {PathNotUniqueException} - If a library with the same path (excluding the one being updated) already exists.
   */
  public async updateById(
    libraryId: string,
    name?: string,
    path?: string,
  ): Promise<LibraryResponse> {
    const libraryEntity = await this.librariesRepository.findOne({
      where: { id: libraryId },
    });

    if (!libraryEntity) {
      throw new LibraryNotFoundException(libraryId);
    }

    if (name && libraryEntity.name !== name) {
      libraryEntity.name = name;
    }

    if (path && libraryEntity.path !== path) {
      const libraryExists = await this.librariesRepository.exist({
        where: { id: Not(libraryId), path },
      });

      if (libraryExists) {
        throw new PathNotUniqueException(path);
      }

      libraryEntity.path = path;
    }

    return await this.librariesRepository
      .save(libraryEntity)
      .then(LibraryService.toLibraryDto);
  }

  /**
   * Deletes the library by its unique identifier.
   *
   * This method retrieves the `Library` entity based on the provided `libraryId` and then removes it from the database.
   * If the library with the provided ID is not found, it throws a `LibraryNotFoundException`.
   *
   * @param libraryId - The unique identifier of the library to be deleted.
   *
   * @throws {LibraryNotFoundException} - If a library with the provided ID is not found.
   *
   * @returns A promise that resolves when the deletion is complete. The promise does not carry any value.
   */
  public async deleteById(libraryId: string): Promise<void> {
    const libraryEntity = await this.librariesRepository.findOne({
      where: { id: libraryId },
    });

    if (!libraryEntity) {
      throw new LibraryNotFoundException(libraryId);
    }

    await this.librariesRepository.remove(libraryEntity);
  }

  /**
   * Converts a LibraryEntity object into a LibraryDto object.
   * @param libraryEntity - The LibraryEntity object to convert.
   * @returns - The converted LibraryDto object.
   */
  private static toLibraryDto(libraryEntity: LibraryEntity): LibraryResponse {
    const { id, name, path, createdAt, updatedAt } = libraryEntity;
    return {
      id,
      name,
      path,
      createdAt,
      updatedAt,
    };
  }

  /**
   * Converts a `LibrarySortOrder` enum into the corresponding `LibraryEntity` property.
   *
   * @param librarySortOrder - The order in which to sort libraries. This is an optional parameter that defaults to `LIBRARY_QUERY_DEFAULT_SORT_ORDER`.
   *
   * @returns A string representing the property of `LibraryEntity` to which `librarySortOrder` corresponds.
   * This can be 'name', 'updatedAt', or 'createdAt'.
   *
   * @example
   * ```
   * const sortOrder = toEntitySortOrder(LibrarySortOrder.NAME);
   * console.log(sortOrder); // Outputs: 'name'
   * ```
   */
  private static toEntitySortOrder = (
    librarySortOrder: LibrarySortOrder,
  ): keyof Pick<LibraryEntity, 'name' | 'updatedAt' | 'createdAt'> => {
    switch (librarySortOrder) {
      case LibrarySortOrder.NAME:
        return 'name';
      case LibrarySortOrder.UPDATED_AT:
        return 'updatedAt';
      case LibrarySortOrder.CREATED_AT:
      default:
        return 'createdAt';
    }
  };
}
