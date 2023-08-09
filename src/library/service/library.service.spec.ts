import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { PathNotUniqueException } from '../exception';
import { LibraryEntity } from '../model';
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

  describe('createLibrary', () => {
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

      const result = await service.createLibrary(inputName, inputPath);

      expect(result.name).toBe(inputName);
      expect(result.path).toBe(inputPath);
    });

    it('should throw PathNotUniqueException if library with same path exists', async () => {
      const inputName = 'Test Library';
      const inputPath = '/path/to/library';

      jest.spyOn(repository, 'exist').mockResolvedValue(true);

      await expect(service.createLibrary(inputName, inputPath)).rejects.toThrow(
        PathNotUniqueException,
      );
    });
  });
});
