import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { FileNotFoundException } from '../exception';
import { FileDto, FileEntity, FilePageDto } from '../model';

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
   * @param orderType - The order type (ASC or DESC). Defaults to 'DESC'.
   * @param nameFilter - Optional name filter to apply to the file names.
   * @returns - A promise that will resolve to a `FilePageDto` containing the fetched files and page information.
   */
  public async findAll(
    page: number = 0,
    size: number = 10,
    order: 'name' | 'size' | 'createdAt' | 'updatedAt' = 'createdAt',
    orderType: 'ASC' | 'DESC' = 'DESC',
    nameFilter?: string,
  ): Promise<FilePageDto> {
    const skip = page * size;

    const orderObject = {};
    orderObject[order] = orderType;

    const whereObject = {};
    if (nameFilter) {
      whereObject['name'] = Like(`%${nameFilter}%`);
    }

    const [results, totalElements] = await this.filesRepository.findAndCount({
      where: whereObject,
      order: orderObject,
      take: size,
      skip,
    });

    return {
      results: results.map(FileService.toFileDto),
      page: {
        number: page,
        size,
        totalElements,
        totalPages: Math.ceil(totalElements / size),
      },
    };
  }

  /**
   * Fetches a specific file by ID from the data store.
   * @param fileId - The ID of the file to fetch.
   * @returns - A promise that will resolve to a `FileDto` containing the file data.
   * @throws FileNotFoundException when a file with the given ID is not found.
   */
  public async findById(fileId: string): Promise<FileDto> {
    const entity = await this.filesRepository.findOne({
      where: { id: fileId },
    });
    if (!entity) {
      throw new FileNotFoundException(fileId);
    }
    return FileService.toFileDto(entity);
  }

  /**
   * Converts a FileEntity object into a FileDto object.
   * @param fileEntity - The FileEntity object to convert.
   * @returns - The converted FileDto object.
   */
  private static toFileDto(fileEntity: FileEntity): FileDto {
    const { id, name, size, createdAt, updatedAt } = fileEntity;
    return {
      id,
      name,
      size,
      createdAt,
      updatedAt,
    };
  }
}
