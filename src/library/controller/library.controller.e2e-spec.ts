import { HttpStatus, INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../app';
import { AuthoritiesDto } from '../../auth';

describe('LibraryController (e2e)', () => {
  let app: INestApplication;
  let validJwt: string;
  let forbiddenJwt: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

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
  });

  describe('/libraries (POST)', () => {
    it('should pass with a valid JWT', () => {
      return request(app.getHttpServer())
        .post('/libraries')
        .set('Authorization', `Bearer ${validJwt}`)
        .send({})
        .expect(HttpStatus.OK)
        .then((response) => {
          expect(response.body).toEqual({});
        });
    });

    it('should fail with an invalid JWT', () => {
      return request(app.getHttpServer())
        .post('/libraries')
        .set('Authorization', `Bearer ${forbiddenJwt}`)
        .send({})
        .expect(HttpStatus.FORBIDDEN)
        .then((response) => {
          expect(response.body).toHaveProperty('message', 'Forbidden resource');
          expect(response.body).toHaveProperty('timestamp');
        });
    });
  });
});
