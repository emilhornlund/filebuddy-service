import { HttpStatus, INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { AppModule } from '../../app';
import { AuthoritiesDto } from '../../auth';
import { FileEntity } from '../model/entity';
import {
  FILE_QUERY_MAXIMUM_PAGE_SIZE,
  FILE_QUERY_MINIMUM_PAGE_NUMBER,
  FILE_QUERY_MINIMUM_PAGE_SIZE,
} from '../model/query';

describe('FileController (e2e)', () => {
  let app: INestApplication;
  let fileRepository: Repository<FileEntity>;
  let fileEntities: FileEntity[];
  let validJwt: string;
  let forbiddenJwt: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    fileRepository = moduleFixture.get(getRepositoryToken(FileEntity));

    fileEntities = Array.from({ length: 20 }, (_, i) => {
      const paddedFileNumber = (i + 1).toString().padStart(2, '0');
      const fileName = i % 2 == 0 ? 'Image' : 'Text';
      const fileExtension = i % 2 == 0 ? 'png' : 'txt';
      const fileEntity = fileRepository.create();
      fileEntity.name = `${fileName} #${paddedFileNumber}`;
      fileEntity.path = `${fileName}_#${paddedFileNumber}.${fileExtension}`;
      fileEntity.type = i % 2 == 0 ? 'image/jpeg' : 'text/plain';
      fileEntity.size = i + 1;

      const date = new Date();
      date.setDate(date.getDate() - 60 - i);
      fileEntity.createdAt = date;
      date.setTime(date.getTime() - i);
      fileEntity.updatedAt = date;

      return fileEntity;
    });

    await fileRepository.save(fileEntities);

    const jwtService = app.get(JwtService);
    validJwt = jwtService.sign(
      {
        authorities: [AuthoritiesDto.FILE_MANAGEMENT],
      },
      {},
    );
    forbiddenJwt = jwtService.sign(
      {
        authorities: [],
      },
      {},
    );
  });

  describe('/files (POST)', () => {
    it('should pass with an empty page of files when no files exists', () => {
      fileRepository.clear();

      return request(app.getHttpServer())
        .get('/files')
        .set('Authorization', `Bearer ${validJwt}`)
        .expect(HttpStatus.OK)
        .then((response) => {
          expect(response.body).toHaveProperty('results', []);
          expect(response.body).toHaveProperty('page', {
            number: 0,
            size: 10,
            total_elements: 0,
            total_pages: 0,
          });
        });
    });

    it('should pass with the first page of files with default query parameters', () => {
      return request(app.getHttpServer())
        .get('/files')
        .set('Authorization', `Bearer ${validJwt}`)
        .expect(HttpStatus.OK)
        .then((response) => {
          expect(response.body).toHaveProperty(
            'results',
            fileEntities
              .slice(0, 10)
              .map(({ id, name, type, size, createdAt, updatedAt }) => ({
                id,
                name,
                type,
                size,
                created_at: createdAt.toISOString(),
                updated_at: updatedAt.toISOString(),
              })),
          );
          expect(response.body).toHaveProperty('page', {
            number: 0,
            size: 10,
            total_elements: 20,
            total_pages: 2,
          });
        });
    });

    it('should pass if page number is a numbered string', () => {
      return request(app.getHttpServer())
        .get('/files')
        .query({ page: '0' })
        .set('Authorization', `Bearer ${validJwt}`)
        .expect(HttpStatus.OK)
        .then((response) => {
          expect(response.body).toHaveProperty('results');
          expect(response.body).toHaveProperty('page', {
            number: 0,
            size: 10,
            total_elements: 20,
            total_pages: 2,
          });
        });
    });

    it('should fail if page number is a non numbered string', () => {
      return request(app.getHttpServer())
        .get('/files')
        .query({ page: 'NaN' })
        .set('Authorization', `Bearer ${validJwt}`)
        .expect(HttpStatus.BAD_REQUEST)
        .then((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              message: 'Validation failed',
              timestamp: expect.any(String),
              validation_errors: [
                {
                  constraints: {
                    is_int: 'page must be an integer number',
                    min: 'page must not be less than 0',
                  },
                  property: 'page',
                },
              ],
            }),
          );
        });
    });

    it('should pass if page number is a floating number', () => {
      return request(app.getHttpServer())
        .get('/files')
        .query({ page: 0.0 })
        .set('Authorization', `Bearer ${validJwt}`)
        .expect(HttpStatus.OK)
        .then((response) => {
          expect(response.body).toHaveProperty('results');
          expect(response.body).toHaveProperty('page', {
            number: 0,
            size: 10,
            total_elements: 20,
            total_pages: 2,
          });
        });
    });

    it('should fail if page number is less than minimum allowed', () => {
      return request(app.getHttpServer())
        .get('/files')
        .query({ page: FILE_QUERY_MINIMUM_PAGE_NUMBER - 1 })
        .set('Authorization', `Bearer ${validJwt}`)
        .expect(HttpStatus.BAD_REQUEST)
        .then((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              message: 'Validation failed',
              timestamp: expect.any(String),
              validation_errors: [
                {
                  constraints: {
                    min: 'page must not be less than 0',
                  },
                  property: 'page',
                },
              ],
            }),
          );
        });
    });

    it('should pass if page size is a numbered string', () => {
      return request(app.getHttpServer())
        .get('/files')
        .query({ size: '10' })
        .set('Authorization', `Bearer ${validJwt}`)
        .expect(HttpStatus.OK)
        .then((response) => {
          expect(response.body).toHaveProperty('results');
          expect(response.body).toHaveProperty('page', {
            number: 0,
            size: 10,
            total_elements: 20,
            total_pages: 2,
          });
        });
    });

    it('should fail if page size is a non numbered string', () => {
      return request(app.getHttpServer())
        .get('/files')
        .query({ size: 'NaN' })
        .set('Authorization', `Bearer ${validJwt}`)
        .expect(HttpStatus.BAD_REQUEST)
        .then((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              message: 'Validation failed',
              timestamp: expect.any(String),
              validation_errors: [
                {
                  constraints: {
                    is_int: 'size must be an integer number',
                    max: 'size must not be greater than 50',
                    min: 'size must not be less than 10',
                  },
                  property: 'size',
                },
              ],
            }),
          );
        });
    });

    it('should pass if page size is a floating number', () => {
      return request(app.getHttpServer())
        .get('/files')
        .query({ size: 10.0 })
        .set('Authorization', `Bearer ${validJwt}`)
        .expect(HttpStatus.OK)
        .then((response) => {
          expect(response.body).toHaveProperty('results');
          expect(response.body).toHaveProperty('page', {
            number: 0,
            size: 10,
            total_elements: 20,
            total_pages: 2,
          });
        });
    });

    it('should fail if page size is less than minimum allowed', () => {
      return request(app.getHttpServer())
        .get('/files')
        .query({ size: FILE_QUERY_MINIMUM_PAGE_SIZE - 1 })
        .set('Authorization', `Bearer ${validJwt}`)
        .expect(HttpStatus.BAD_REQUEST)
        .then((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              message: 'Validation failed',
              timestamp: expect.any(String),
              validation_errors: [
                {
                  constraints: {
                    min: 'size must not be less than 10',
                  },
                  property: 'size',
                },
              ],
            }),
          );
        });
    });

    it('should fail if page size is greater than maximum allowed', () => {
      return request(app.getHttpServer())
        .get('/files')
        .query({ size: FILE_QUERY_MAXIMUM_PAGE_SIZE + 1 })
        .set('Authorization', `Bearer ${validJwt}`)
        .expect(HttpStatus.BAD_REQUEST)
        .then((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              message: 'Validation failed',
              timestamp: expect.any(String),
              validation_errors: [
                {
                  constraints: {
                    max: 'size must not be greater than 50',
                  },
                  property: 'size',
                },
              ],
            }),
          );
        });
    });

    it('should pass with a page of files matching image file names', () => {
      return request(app.getHttpServer())
        .get('/files')
        .query({ name: 'Image' })
        .set('Authorization', `Bearer ${validJwt}`)
        .expect(HttpStatus.OK)
        .then((response) => {
          expect(response.body).toHaveProperty(
            'results',
            fileEntities
              .filter(({ name }) => name.includes('Image'))
              .slice(0, 10)
              .map(({ id, name, type, size, createdAt, updatedAt }) => ({
                id,
                name,
                type,
                size,
                created_at: createdAt.toISOString(),
                updated_at: updatedAt.toISOString(),
              })),
          );
          expect(response.body).toHaveProperty('page', {
            number: 0,
            size: 10,
            total_elements: 10,
            total_pages: 1,
          });
        });
    });

    it('should pass with a page of files ordered by size in default descending order', () => {
      return request(app.getHttpServer())
        .get('/files')
        .query({ order: 'SIZE' })
        .set('Authorization', `Bearer ${validJwt}`)
        .expect(HttpStatus.OK)
        .then((response) => {
          expect(response.body).toHaveProperty(
            'results',
            fileEntities
              .reverse()
              .slice(0, 10)
              .map(({ id, name, type, size, createdAt, updatedAt }) => ({
                id,
                name,
                type,
                size,
                created_at: createdAt.toISOString(),
                updated_at: updatedAt.toISOString(),
              })),
          );
          expect(response.body).toHaveProperty('page', {
            number: 0,
            size: 10,
            total_elements: 20,
            total_pages: 2,
          });
        });
    });

    it('should pass with a page of files ordered by size in ascending order', () => {
      return request(app.getHttpServer())
        .get('/files')
        .query({ order: 'SIZE', direction: 'ASC' })
        .set('Authorization', `Bearer ${validJwt}`)
        .expect(HttpStatus.OK)
        .then((response) => {
          expect(response.body).toHaveProperty(
            'results',
            fileEntities
              .slice(0, 10)
              .map(({ id, name, type, size, createdAt, updatedAt }) => ({
                id,
                name,
                type,
                size,
                created_at: createdAt.toISOString(),
                updated_at: updatedAt.toISOString(),
              })),
          );
          expect(response.body).toHaveProperty('page', {
            number: 0,
            size: 10,
            total_elements: 20,
            total_pages: 2,
          });
        });
    });

    it('should pass with a page of files ordered by updated at in default descending order', () => {
      return request(app.getHttpServer())
        .get('/files')
        .query({ order: 'UPDATED_AT' })
        .set('Authorization', `Bearer ${validJwt}`)
        .expect(HttpStatus.OK)
        .then((response) => {
          expect(response.body).toHaveProperty(
            'results',
            fileEntities
              .slice(0, 10)
              .map(({ id, name, type, size, createdAt, updatedAt }) => ({
                id,
                name,
                type,
                size,
                created_at: createdAt.toISOString(),
                updated_at: updatedAt.toISOString(),
              })),
          );
          expect(response.body).toHaveProperty('page', {
            number: 0,
            size: 10,
            total_elements: 20,
            total_pages: 2,
          });
        });
    });

    it('should fail if order is unknown', () => {
      return request(app.getHttpServer())
        .get('/files')
        .query({ order: 'UNKNOWN' })
        .set('Authorization', `Bearer ${validJwt}`)
        .expect(HttpStatus.BAD_REQUEST)
        .then((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              message: 'Validation failed',
              timestamp: expect.any(String),
              validation_errors: [
                {
                  constraints: {
                    is_enum:
                      'order must be one of the following values: NAME, SIZE, CREATED_AT, UPDATED_AT',
                  },
                  property: 'order',
                },
              ],
            }),
          );
        });
    });

    it('should fail if missing file management authority', () => {
      return request(app.getHttpServer())
        .get('/files')
        .set('Authorization', `Bearer ${forbiddenJwt}`)
        .expect(HttpStatus.FORBIDDEN)
        .then((response) => {
          expect(response.body).toHaveProperty('message', 'Forbidden resource');
          expect(response.body).toHaveProperty('timestamp');
        });
    });

    it('should fail if missing jwt', () => {
      return request(app.getHttpServer())
        .get('/files')
        .expect(HttpStatus.UNAUTHORIZED)
        .then((response) => {
          expect(response.body).toHaveProperty('message', 'Unauthorized');
          expect(response.body).toHaveProperty('timestamp');
        });
    });
  });

  describe('/files/:fileId (POST)', () => {
    it('should pass if the file exists', () => {
      const firstFileEntity = fileEntities[0];

      return request(app.getHttpServer())
        .get(`/files/${fileEntities[0].id}`)
        .set('Authorization', `Bearer ${validJwt}`)
        .expect(HttpStatus.OK)
        .then((response) => {
          expect(response.body).toEqual({
            id: firstFileEntity.id,
            name: firstFileEntity.name,
            type: firstFileEntity.type,
            size: firstFileEntity.size,
            created_at: firstFileEntity.createdAt.toISOString(),
            updated_at: firstFileEntity.updatedAt.toISOString(),
          });
        });
    });

    it('should fail if the file was not found', () => {
      const fileId = uuidv4();
      return request(app.getHttpServer())
        .get(`/files/${fileId}`)
        .set('Authorization', `Bearer ${validJwt}`)
        .expect(HttpStatus.NOT_FOUND)
        .then((response) => {
          expect(response.body).toHaveProperty(
            'message',
            `File was not found by id \`${fileId}\``,
          );
          expect(response.body).toHaveProperty('timestamp');
        });
    });

    it('should fail if file id is not of UUID type', () => {
      return request(app.getHttpServer())
        .get(`/files/INVALID_UUID`)
        .set('Authorization', `Bearer ${validJwt}`)
        .expect(HttpStatus.BAD_REQUEST)
        .then((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              message: 'Validation failed',
              timestamp: expect.any(String),
              validation_errors: [
                {
                  constraints: {
                    is_uuid: 'fileId must be a UUID',
                  },
                  property: 'fileId',
                },
              ],
            }),
          );
        });
    });

    it('should fail if missing file management authority', () => {
      return request(app.getHttpServer())
        .get(`/files/${uuidv4()}`)
        .set('Authorization', `Bearer ${forbiddenJwt}`)
        .expect(HttpStatus.FORBIDDEN)
        .then((response) => {
          expect(response.body).toHaveProperty('message', 'Forbidden resource');
          expect(response.body).toHaveProperty('timestamp');
        });
    });

    it('should fail if missing jwt', () => {
      return request(app.getHttpServer())
        .get(`/files/${uuidv4()}`)
        .expect(HttpStatus.UNAUTHORIZED)
        .then((response) => {
          expect(response.body).toHaveProperty('message', 'Unauthorized');
          expect(response.body).toHaveProperty('timestamp');
        });
    });
  });
});
