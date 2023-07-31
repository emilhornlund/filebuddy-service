import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../app';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/token (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/token')
      .send({
        username: 'testUser',
        password: 'testPass',
      })
      .expect(HttpStatus.OK)
      .then((response) => {
        expect(response.body).toHaveProperty('access_token');
        expect(response.body).toHaveProperty('refresh_token');
      });
  });

  it('/auth/refresh (POST)', () => {
    let refreshToken;
    return request(app.getHttpServer())
      .post('/auth/token')
      .send({
        username: 'testUser',
        password: 'testPass',
      })
      .then((response) => {
        refreshToken = response.body.refresh_token;
        return request(app.getHttpServer())
          .post('/auth/refresh')
          .set('Authorization', `Bearer ${refreshToken}`)
          .expect(HttpStatus.OK)
          .then((response) => {
            expect(response.body).toHaveProperty('access_token');
            expect(response.body).toHaveProperty('refresh_token');
            expect(response.body.refreshToken).not.toBe(refreshToken);
          });
      });
  });
});
