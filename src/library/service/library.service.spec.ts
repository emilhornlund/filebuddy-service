import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { LibraryNotFoundException, PathNotUniqueException } from '../exception';
import {
  LibraryEntity,
  LibrarySortDirection,
  LibrarySortOrder,
} from '../model';
import { LibraryService } from './library.service';

describe('LibraryService', () => {
  let service: LibraryService;
  let repository: Repository<LibraryEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LibraryService,
        {
          provide: getRepositoryToken(LibraryEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<LibraryService>(LibraryService);
    repository = module.get<Repository<LibraryEntity>>(
      getRepositoryToken(LibraryEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a library successfully', async () => {
      const inputName = 'Test Library';
      const inputPath = '/path/to/library';
      const mockLibraryEntity: LibraryEntity = {
        id: uuidv4(),
        name: inputName,
        path: inputPath,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(repository, 'exist').mockResolvedValue(false);
      jest.spyOn(repository, 'create').mockReturnValue(mockLibraryEntity);
      jest.spyOn(repository, 'save').mockResolvedValue(mockLibraryEntity);

      const result = await service.create(inputName, inputPath);

      expect(result.name).toBe(inputName);
      expect(result.path).toBe(inputPath);
    });

    it('should throw PathNotUniqueException if library with same path exists', async () => {
      const inputName = 'Test Library';
      const inputPath = '/path/to/library';

      jest.spyOn(repository, 'exist').mockResolvedValue(true);

      await expect(service.create(inputName, inputPath)).rejects.toThrow(
        PathNotUniqueException,
      );
    });
  });

  describe('findAll', () => {
    it('should return a paginated list of librarys', async () => {
      const libraryEntity = new LibraryEntity();
      libraryEntity.id = uuidv4();
      libraryEntity.name = 'Test Library';
      libraryEntity.path = '/path/to/library';
      libraryEntity.createdAt = new Date();
      libraryEntity.updatedAt = new Date();

      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValue([[libraryEntity], 1]);

      const result = await service.findAll();

      expect(result).toEqual({
        results: [
          {
            id: libraryEntity.id,
            name: libraryEntity.name,
            path: libraryEntity.path,
            createdAt: libraryEntity.createdAt,
            updatedAt: libraryEntity.updatedAt,
          },
        ],
        page: {
          number: 0,
          size: 10,
          totalElements: 1,
          totalPages: 1,
        },
      });
    });

    it('should call repository.findAndCount with correct parameters', async () => {
      const spy = jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValue([[], 0]);
      await service.findAll(
        1,
        5,
        LibrarySortOrder.NAME,
        LibrarySortDirection.ASC,
        'test',
      );

      expect(spy).toHaveBeenCalledWith({
        where: { name: Like('%test%') },
        order: { name: 'ASC' },
        take: 5,
        skip: 5,
      });

      spy.mockClear();
    });
  });

  describe('findById', () => {
    it('should return a library by id', async () => {
      const libraryEntity = new LibraryEntity();
      libraryEntity.id = uuidv4();
      libraryEntity.name = 'Test Library';
      libraryEntity.path = '/path/to/library';
      libraryEntity.createdAt = new Date();
      libraryEntity.updatedAt = new Date();

      jest.spyOn(repository, 'findOne').mockResolvedValue(libraryEntity);

      const result = await service.findById(libraryEntity.id);

      expect(result).toEqual({
        id: libraryEntity.id,
        name: libraryEntity.name,
        path: libraryEntity.path,
        createdAt: libraryEntity.createdAt,
        updatedAt: libraryEntity.updatedAt,
      });
    });

    it('should throw an error if library not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findById(uuidv4())).rejects.toThrow(
        LibraryNotFoundException,
      );
    });
  });

  describe('updateById', () => {
    it('should update a library by id', async () => {
      const mockOldLibraryEntity = new LibraryEntity();
      mockOldLibraryEntity.id = uuidv4();
      mockOldLibraryEntity.name = 'Test Library';
      mockOldLibraryEntity.path = '/path/to/library';
      mockOldLibraryEntity.createdAt = new Date();
      mockOldLibraryEntity.updatedAt = new Date();

      const mockNewLibraryEntity = mockOldLibraryEntity;
      mockOldLibraryEntity.name = 'New Test Library';
      mockOldLibraryEntity.path = '/new/path/to/library';

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockOldLibraryEntity);
      jest.spyOn(repository, 'exist').mockResolvedValue(false);
      jest.spyOn(repository, 'save').mockResolvedValue(mockNewLibraryEntity);

      const result = await service.updateById(
        mockOldLibraryEntity.id,
        mockNewLibraryEntity.name,
        mockNewLibraryEntity.path,
      );

      expect(result).toEqual({
        id: mockOldLibraryEntity.id,
        name: mockNewLibraryEntity.name,
        path: mockNewLibraryEntity.path,
        createdAt: mockOldLibraryEntity.createdAt,
        updatedAt: mockOldLibraryEntity.updatedAt,
      });
    });

    it('should throw an error if library not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(
        service.updateById(
          uuidv4(),
          'New Test Library',
          '/new/path/to/library',
        ),
      ).rejects.toThrow(LibraryNotFoundException);
    });

    it('should throw PathNotUniqueException if library with same path exists', async () => {
      const mockOldLibraryEntity = new LibraryEntity();
      mockOldLibraryEntity.id = uuidv4();
      mockOldLibraryEntity.name = 'Test Library';
      mockOldLibraryEntity.path = '/path/to/library';
      mockOldLibraryEntity.createdAt = new Date();
      mockOldLibraryEntity.updatedAt = new Date();

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockOldLibraryEntity);
      jest.spyOn(repository, 'exist').mockResolvedValue(true);

      await expect(
        service.updateById(
          mockOldLibraryEntity.id,
          'New Test Library',
          '/new/path/to/library',
        ),
      ).rejects.toThrow(PathNotUniqueException);
    });
  });

  describe('deleteById', () => {
    it('should delete a library by id', async () => {
      const libraryEntity = new LibraryEntity();
      libraryEntity.id = uuidv4();
      libraryEntity.name = 'Test Library';
      libraryEntity.path = '/path/to/library';
      libraryEntity.createdAt = new Date();
      libraryEntity.updatedAt = new Date();

      jest.spyOn(repository, 'findOne').mockResolvedValue(libraryEntity);
      jest.spyOn(repository, 'remove').mockResolvedValue(libraryEntity);

      const result = await service.deleteById(libraryEntity.id);

      expect(result).toBe(void 0);
    });

    it('should throw an error if library not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.deleteById(uuidv4())).rejects.toThrow(
        LibraryNotFoundException,
      );
    });
  });
});
