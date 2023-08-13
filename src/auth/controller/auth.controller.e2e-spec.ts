import { HttpStatus, INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../app';
import { AuthoritiesDto } from '../model/security';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/auth/token (POST)', () => {
    it('should pass if valid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/token')
        .send({
          username: 'testUser',
          password: 'testPass1$',
        })
        .expect(HttpStatus.OK)
        .then((response) => {
          expect(response.body).toHaveProperty('access_token');
          expect(response.body).toHaveProperty('refresh_token');
        });
    });

    it('should fail if invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/token')
        .send({
          username: 'invalidUser',
          password: 'invalidPass123@',
        })
        .expect(HttpStatus.UNAUTHORIZED)
        .then((response) => {
          expect(response.body).toHaveProperty('message', 'Unauthorized');
          expect(response.body).toHaveProperty('timestamp');
        });
    });

    it('should fail if missing credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/token')
        .send()
        .expect(HttpStatus.BAD_REQUEST)
        .then((response) => {
          expect(response.body).toHaveProperty('message', 'Validation failed');
          expect(response.body).toHaveProperty('validation_errors', [
            {
              constraints: {
                is_not_empty: 'username should not be empty',
                is_length: 'username must be between 4 and 20 characters',
                matches: 'username must contain only alphanumeric characters',
              },
              property: 'username',
            },
            {
              constraints: {
                is_not_empty: 'password should not be empty',
                is_length: 'password must be between 8 and 30 characters',
                matches:
                  'password must have at least one uppercase letter, one lowercase letter, one number, and one special character',
              },
              property: 'password',
            },
          ]);
          expect(response.body).toHaveProperty('timestamp');
        });
    });
  });

  describe('/auth/refresh (POST)', () => {
    it('should pass if valid refresh token', () => {
      let refreshToken;
      return request(app.getHttpServer())
        .post('/auth/token')
        .send({
          username: 'testUser',
          password: 'testPass1$',
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

    it('should fail if refresh using access token', () => {
      let access_token;
      return request(app.getHttpServer())
        .post('/auth/token')
        .send({
          username: 'testUser',
          password: 'testPass1$',
        })
        .then((response) => {
          access_token = response.body.access_token;
          return request(app.getHttpServer())
            .post('/auth/refresh')
            .set('Authorization', `Bearer ${access_token}`)
            .expect(HttpStatus.FORBIDDEN)
            .then((response) => {
              expect(response.body).toHaveProperty(
                'message',
                'Forbidden resource',
              );
              expect(response.body).toHaveProperty('timestamp');
            });
        });
    });

    it('should fail if invalid refresh token', () => {
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', 'Bearer INVALID_TOKEN')
        .expect(HttpStatus.UNAUTHORIZED)
        .then((response) => {
          expect(response.body).toHaveProperty('message', 'Unauthorized');
          expect(response.body).toHaveProperty('timestamp');
        });
    });

    it('should fail if missing refresh authority', () => {
      const jwtService = app.get(JwtService);
      const refreshToken = jwtService.sign(
        {
          authorities: [],
        },
        {},
      );
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${refreshToken}`)
        .expect(HttpStatus.FORBIDDEN)
        .then((response) => {
          expect(response.body).toHaveProperty('message', 'Forbidden resource');
          expect(response.body).toHaveProperty('timestamp');
        });
    });

    it('should fail if expired refresh token', () => {
      const jwtService = app.get(JwtService);
      const refreshToken = jwtService.sign(
        {
          authorities: [AuthoritiesDto.REFRESH],
        },
        { expiresIn: -1 },
      );
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${refreshToken}`)
        .expect(HttpStatus.UNAUTHORIZED)
        .then((response) => {
          expect(response.body).toHaveProperty('message', 'Unauthorized');
          expect(response.body).toHaveProperty('timestamp');
        });
    });

    it('should fail if invalid issuer', () => {
      const jwtService = app.get(JwtService);
      const refreshToken = jwtService.sign(
        {
          authorities: [AuthoritiesDto.REFRESH],
        },
        { issuer: 'unknown' },
      );
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${refreshToken}`)
        .expect(HttpStatus.UNAUTHORIZED)
        .then((response) => {
          expect(response.body).toHaveProperty('message', 'Unauthorized');
          expect(response.body).toHaveProperty('timestamp');
        });
    });

    it('should fail if invalid audience', () => {
      const jwtService = app.get(JwtService);
      const refreshToken = jwtService.sign(
        {
          authorities: [AuthoritiesDto.REFRESH],
        },
        { audience: 'unknown' },
      );
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${refreshToken}`)
        .expect(HttpStatus.UNAUTHORIZED)
        .then((response) => {
          expect(response.body).toHaveProperty('message', 'Unauthorized');
          expect(response.body).toHaveProperty('timestamp');
        });
    });
  });
});
