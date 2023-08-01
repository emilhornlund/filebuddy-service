import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { FileNotFoundException } from '../exception';
import { FileEntity } from '../model';
import { FileService } from './file.service';

describe('FileService', () => {
  let service: FileService;
  let repository: Repository<FileEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileService,
        {
          provide: getRepositoryToken(FileEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<FileService>(FileService);
    repository = module.get<Repository<FileEntity>>(
      getRepositoryToken(FileEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a paginated list of files', async () => {
      const fileEntity = new FileEntity();
      fileEntity.id = uuidv4();
      fileEntity.name = 'test';
      fileEntity.size = 100;
      fileEntity.createdAt = new Date();
      fileEntity.updatedAt = new Date();

      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValue([[fileEntity], 1]);

      const result = await service.findAll();

      expect(result).toEqual({
        results: [
          {
            id: fileEntity.id,
            name: fileEntity.name,
            size: fileEntity.size,
            createdAt: fileEntity.createdAt,
            updatedAt: fileEntity.updatedAt,
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
      await service.findAll(1, 5, 'name', 'ASC', 'test');

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
    it('should return a file by id', async () => {
      const fileEntity = new FileEntity();
      fileEntity.id = uuidv4();
      fileEntity.name = 'test';
      fileEntity.size = 100;
      fileEntity.createdAt = new Date();
      fileEntity.updatedAt = new Date();

      jest.spyOn(repository, 'findOne').mockResolvedValue(fileEntity);

      const result = await service.findById(fileEntity.id);

      expect(result).toEqual({
        id: fileEntity.id,
        name: fileEntity.name,
        size: fileEntity.size,
        createdAt: fileEntity.createdAt,
        updatedAt: fileEntity.updatedAt,
      });
    });

    it('should throw an error if file not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findById(uuidv4())).rejects.toThrow(
        FileNotFoundException,
      );
    });
  });
});
