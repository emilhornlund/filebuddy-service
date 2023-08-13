import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { toPageDto } from '../../app/model/response';
import { FileNotFoundException } from '../exception';
import { FileEntity } from '../model/entity';
import { FileSortDirection, FileSortOrder } from '../model/enum';
import { FileResponse, PagedFileResponse } from '../model/response';
import {
  FILE_QUERY_DEFAULT_FILE_SORT_DIRECTION,
  FILE_QUERY_DEFAULT_FILE_SORT_ORDER,
  FILE_QUERY_DEFAULT_PAGE,
  FILE_QUERY_DEFAULT_PAGE_SIZE,
} from '../utility/file-query-constants.utility';

/**
 * A service that handles file-related operations.
 * @Injectable
 */
@Injectable()
export class FileService {
  /**
   * Constructs the FileService. Automatically injects file repository.
   * @param filesRepository - The repository for interacting with the files data store.
   */
  constructor(
    @InjectRepository(FileEntity)
    private filesRepository: Repository<FileEntity>,
  ) {}

  /**
   * Fetches all files from the data store and provides pagination and sorting functionality.
   * @param page - The number of the page to fetch. Defaults to 0.
   * @param size - The number of items per page. Defaults to 10.
   * @param order - The field by which to order the results. Defaults to 'createdAt'.
   * @param direction - The order type (ASC or DESC). Defaults to 'DESC'.
   * @param nameFilter - Optional name filter to apply to the file names.
   * @returns - A promise that will resolve to a `PagedFileResponse` containing the fetched files and page information.
   */
  public async findAll(
    page: number = FILE_QUERY_DEFAULT_PAGE,
    size: number = FILE_QUERY_DEFAULT_PAGE_SIZE,
    order: FileSortOrder = FILE_QUERY_DEFAULT_FILE_SORT_ORDER,
    direction: FileSortDirection = FILE_QUERY_DEFAULT_FILE_SORT_DIRECTION,
    nameFilter?: string,
  ): Promise<PagedFileResponse> {
    const skip = page * size;

    const orderParams = {};
    orderParams[FileService.toEntitySortOrder(order)] = direction;

    const queryCondition = {};
    if (nameFilter) {
      queryCondition['name'] = Like(`%${nameFilter}%`);
    }

    const [results, totalElements] = await this.filesRepository.findAndCount({
      where: queryCondition,
      order: orderParams,
      take: size,
      skip,
    });

    return toPageDto(
      results.map(FileService.toFileResponse),
      page,
      size,
      totalElements,
    );
  }

  /**
   * Fetches a specific file by ID from the data store.
   * @param fileId - The ID of the file to fetch.
   * @returns - A promise that will resolve to a `FileResponse` containing the file data.
   * @throws FileNotFoundException when a file with the given ID is not found.
   */
  public async findById(fileId: string): Promise<FileResponse> {
    const entity = await this.filesRepository.findOne({
      where: { id: fileId },
    });
    if (!entity) {
      throw new FileNotFoundException(fileId);
    }
    return FileService.toFileResponse(entity);
  }

  /**
   * Converts a FileEntity object into a FileResponse object.
   * @param fileEntity - The FileEntity object to convert.
   * @returns - The converted FileResponse object.
   */
  private static toFileResponse(fileEntity: FileEntity): FileResponse {
    const { id, name, type, size, createdAt, updatedAt } = fileEntity;
    return {
      id,
      name,
      type,
      size,
      createdAt,
      updatedAt,
    };
  }

  /**
   * Converts a `FileSortOrder` enum into the corresponding `FileEntity` property.
   *
   * @param fileSortOrder - The order in which to sort files. This is an optional parameter that defaults to `FILE_QUERY_DEFAULT_FILE_SORT_ORDER`.
   *
   * @returns A string representing the property of `FileEntity` to which `fileSortOrder` corresponds.
   * This can be 'name', 'size', 'updatedAt', or 'createdAt'.
   *
   * @example
   * ```
   * const sortOrder = toEntitySortOrder(FileSortOrder.NAME);
   * console.log(sortOrder); // Outputs: 'name'
   * ```
   */
  private static toEntitySortOrder = (
    fileSortOrder: FileSortOrder,
  ): keyof Pick<FileEntity, 'name' | 'size' | 'updatedAt' | 'createdAt'> => {
    switch (fileSortOrder) {
      case FileSortOrder.NAME:
        return 'name';
      case FileSortOrder.SIZE:
        return 'size';
      case FileSortOrder.UPDATED_AT:
        return 'updatedAt';
      case FileSortOrder.CREATED_AT:
      default:
        return 'createdAt';
    }
  };
}
