import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';

import { FileService } from '../../file';
import { LibraryDto } from '../model';
import { LibraryService } from '../service';
import { LibraryController } from './library.controller';

describe('LibraryController', () => {
  let libraryController: LibraryController;
  let libraryService: LibraryService;

  beforeEach(async () => {
    const mockLibraryService = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LibraryController],
      providers: [
        {
          provide: LibraryService,
          useValue: mockLibraryService,
        },
        {
          provide: FileService,
          useValue: {},
        },
      ],
    }).compile();

    libraryController = module.get<LibraryController>(LibraryController);
    libraryService = module.get<LibraryService>(LibraryService);
  });

  it('should be defined', () => {
    expect(libraryService).toBeDefined();
    expect(libraryController).toBeDefined();
  });

  describe('create', () => {
    it('should create a library successfully', async () => {
      const inputName = 'Test Library';
      const inputPath = '/path/to/library';

      const mockLibraryEntity: LibraryDto = {
        id: uuidv4(),
        name: 'Test Library',
        path: '/path/to/library',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const spy = jest
        .spyOn(libraryService, 'create')
        .mockResolvedValue(mockLibraryEntity);

      const result = await libraryController.create({
        name: inputName,
        path: inputPath,
      });

      expect(spy).toHaveBeenCalledWith(inputName, inputPath);

      expect(result).toEqual(mockLibraryEntity);

      spy.mockClear();
    });
  });
});
