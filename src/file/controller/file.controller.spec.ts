import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import {
  FILE_QUERY_DEFAULT_FILE_SORT_DIRECTION,
  FILE_QUERY_DEFAULT_FILE_SORT_ORDER,
  FILE_QUERY_DEFAULT_PAGE,
  FILE_QUERY_DEFAULT_PAGE_SIZE,
  FileDto,
  FileIdParam,
  FilePageDto,
  FileQueryDto,
  FileSortDirection,
  FileSortOrder,
} from '../model';
import { FileService } from '../service';
import { FileController } from './file.controller';

describe('FileController', () => {
  let fileController: FileController;
  let fileService: FileService;

  beforeEach(async () => {
    const mockFileService = {
      findAll: jest.fn(),
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [
        {
          provide: FileService,
          useValue: mockFileService,
        },
      ],
    }).compile();

    fileController = module.get<FileController>(FileController);
    fileService = module.get<FileService>(FileService);
  });

  it('should be defined', () => {
    expect(fileController).toBeDefined();
    expect(fileService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a FilePageDto with default parameters', async () => {
      const result = new FilePageDto();
      jest
        .spyOn(fileService, 'findAll')
        .mockImplementation(() => of(result).toPromise());

      expect(await fileController.findAll(new FileQueryDto())).toEqual(result);
      expect(fileService.findAll).toHaveBeenCalledWith(
        FILE_QUERY_DEFAULT_PAGE,
        FILE_QUERY_DEFAULT_PAGE_SIZE,
        FILE_QUERY_DEFAULT_FILE_SORT_ORDER,
        FILE_QUERY_DEFAULT_FILE_SORT_DIRECTION,
        undefined,
      );
    });

    it('should return a FilePageDto with custom parameters', async () => {
      const result = new FilePageDto();
      jest
        .spyOn(fileService, 'findAll')
        .mockImplementation(() => of(result).toPromise());

      const customQuery = new FileQueryDto();
      customQuery.page = 2;
      customQuery.size = 10;
      customQuery.order = FileSortOrder.NAME;
      customQuery.direction = FileSortDirection.ASC;

      expect(await fileController.findAll(customQuery)).toEqual(result);
      expect(fileService.findAll).toHaveBeenCalledWith(
        customQuery.page,
        customQuery.size,
        customQuery.order,
        customQuery.direction,
        undefined,
      );
    });

    it('should throw an error if the service fails', async () => {
      jest.spyOn(fileService, 'findAll').mockImplementation(() => {
        throw new Error('Test Error');
      });

      await expect(fileController.findAll(new FileQueryDto())).rejects.toThrow(
        'Test Error',
      );
    });
  });

  describe('findById', () => {
    it('should return a FileDto', async () => {
      const result = new FileDto();
      const fileIdParam = new FileIdParam();
      fileIdParam.fileId = '1234';

      jest
        .spyOn(fileService, 'findById')
        .mockImplementation(() => of(result).toPromise());

      expect(await fileController.findById(fileIdParam)).toEqual(result);
      expect(fileService.findById).toHaveBeenCalledWith(fileIdParam.fileId);
    });

    it('should throw an error if the service fails', async () => {
      const fileIdParam = new FileIdParam();
      fileIdParam.fileId = '1234';

      jest.spyOn(fileService, 'findById').mockImplementation(() => {
        throw new Error('Test Error');
      });

      await expect(fileController.findById(fileIdParam)).rejects.toThrow(
        'Test Error',
      );
    });
  });
});
