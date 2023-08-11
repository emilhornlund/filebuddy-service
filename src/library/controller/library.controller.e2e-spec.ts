import { HttpStatus, INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';

import { AppModule } from '../../app';
import { AuthoritiesDto } from '../../auth';
import { LibraryEntity } from '../model/entity';
import { CreateLibraryRequest } from '../model/request';

describe('LibraryController (e2e)', () => {
  let app: INestApplication;
  let libraryRepository: Repository<LibraryEntity>;
  let validJwt: string;
  let forbiddenJwt: string;
  let expiredJwt: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    libraryRepository = moduleFixture.get(getRepositoryToken(LibraryEntity));

    const jwtService = app.get(JwtService);
    validJwt = jwtService.sign(
      {
        authorities: [AuthoritiesDto.LIBRARY_MANAGEMENT],
      },
      {},
    );
    forbiddenJwt = jwtService.sign(
      {
        authorities: [],
      },
      {},
    );
    expiredJwt = jwtService.sign(
      {
        authorities: [AuthoritiesDto.LIBRARY_MANAGEMENT],
      },
      { expiresIn: -1 },
    );
  });

  describe('/libraries (POST)', () => {
    const mockPayload: CreateLibraryRequest = {
      name: 'Test Library',
      path: '/path/to/library',
    };

    it('should create a library successfully', () => {
      return request(app.getHttpServer())
        .post('/libraries')
        .set('Authorization', `Bearer ${validJwt}`)
        .send(mockPayload)
        .expect(HttpStatus.CREATED)
        .then((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              name: mockPayload.name,
              path: mockPayload.path,
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }),
          );
        });
    });

    it('should create a library with duplicate name successfully', async () => {
      const libraryEntity = libraryRepository.create();
      libraryEntity.name = mockPayload.name;
      libraryEntity.path = '/another/path/to/library';
      await libraryRepository.save(libraryEntity);

      return request(app.getHttpServer())
        .post('/libraries')
        .set('Authorization', `Bearer ${validJwt}`)
        .send(mockPayload)
        .expect(HttpStatus.CREATED)
        .then((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              name: mockPayload.name,
              path: mockPayload.path,
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }),
          );
        });
    });

    it('should fail if path is not unique', async () => {
      const libraryEntity = libraryRepository.create();
      libraryEntity.name = mockPayload.name;
      libraryEntity.path = mockPayload.path;
      await libraryRepository.save(libraryEntity);

      return request(app.getHttpServer())
        .post('/libraries')
        .set('Authorization', `Bearer ${validJwt}`)
        .send(mockPayload)
        .expect(HttpStatus.CONFLICT)
        .then((response) => {
          expect(response.body).toHaveProperty(
            'message',
            `Path \`${mockPayload.path}\` was not unique.`,
          );
          expect(response.body).toHaveProperty('timestamp');
        });
    });

    it('should fail if missing payload', () => {
      return request(app.getHttpServer())
        .post('/libraries')
        .set('Authorization', `Bearer ${validJwt}`)
        .expect(HttpStatus.BAD_REQUEST)
        .then((response) => {
          expect(response.body).toHaveProperty('message', 'Validation failed');
          expect(response.body).toHaveProperty('validation_errors', [
            {
              constraints: {
                is_length: 'name must be between 2 and 20 characters',
                is_not_empty: 'name should not be empty',
                matches: 'name must contain only alphanumeric characters',
              },
              property: 'name',
            },
            {
              constraints: {
                is_not_empty: 'path should not be empty',
                matches:
                  "path must be a valid directory path, starting with a '/' and containing only valid characters. The path should not end with a filename and extension.",
              },
              property: 'path',
            },
          ]);
          expect(response.body).toHaveProperty('timestamp');
        });
    });

    it('should fail if missing library management authority', () => {
      return request(app.getHttpServer())
        .post('/libraries')
        .set('Authorization', `Bearer ${forbiddenJwt}`)
        .send(mockPayload)
        .expect(HttpStatus.FORBIDDEN)
        .then((response) => {
          expect(response.body).toHaveProperty('message', 'Forbidden resource');
          expect(response.body).toHaveProperty('timestamp');
        });
    });

    it('should fail if expired jwt', () => {
      return request(app.getHttpServer())
        .post('/libraries')
        .set('Authorization', `Bearer ${expiredJwt}`)
        .send(mockPayload)
        .expect(HttpStatus.UNAUTHORIZED)
        .then((response) => {
          expect(response.body).toHaveProperty('message', 'Unauthorized');
          expect(response.body).toHaveProperty('timestamp');
        });
    });

    it('should fail if missing jwt', () => {
      return request(app.getHttpServer())
        .post('/libraries')
        .send(mockPayload)
        .expect(HttpStatus.UNAUTHORIZED)
        .then((response) => {
          expect(response.body).toHaveProperty('message', 'Unauthorized');
          expect(response.body).toHaveProperty('timestamp');
        });
    });
  });
});
