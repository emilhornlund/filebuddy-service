import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let configService: ConfigService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    configService = moduleRef.get<ConfigService>(ConfigService);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('authenticate', () => {
    it('should return a token when the correct username and password are provided', async () => {
      const username = 'root';
      const password = 'password';

      jest.spyOn(configService, 'get').mockImplementation((key) => {
        switch (key) {
          case 'SECURITY_ROOT_USERNAME':
            return username;
          case 'SECURITY_ROOT_PASSWORD':
            return password;
          case 'SECURITY_JWT_ACCESS_EXPIRES_IN':
          case 'SECURITY_JWT_REFRESH_EXPIRES_IN':
            return 3600;
          default:
            return null;
        }
      });

      const mockSign = jest
        .spyOn(jwtService, 'signAsync')
        .mockImplementation(() => Promise.resolve('mockToken'));

      const tokens = await authService.authenticate(username, password);

      expect(mockSign).toHaveBeenCalledTimes(2);
      expect(tokens).toEqual({
        accessToken: 'mockToken',
        refreshToken: 'mockToken',
      });
    });

    it('should throw UnauthorizedException when the username or password is incorrect', async () => {
      const username = 'root';
      const password = 'password';

      jest.spyOn(configService, 'get').mockImplementation((key) => {
        switch (key) {
          case 'SECURITY_ROOT_USERNAME':
            return 'otherUsername';
          case 'SECURITY_ROOT_PASSWORD':
            return 'otherPassword';
          default:
            return null;
        }
      });

      await expect(
        authService.authenticate(username, password),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refresh', () => {
    it('should return a new token', async () => {
      const username = 'root';

      jest.spyOn(configService, 'get').mockImplementation((key) => {
        switch (key) {
          case 'SECURITY_ROOT_USERNAME':
            return username;
          case 'SECURITY_JWT_ACCESS_EXPIRES_IN':
          case 'SECURITY_JWT_REFRESH_EXPIRES_IN':
            return 3600;
          default:
            return null;
        }
      });

      const mockSign = jest
        .spyOn(jwtService, 'signAsync')
        .mockImplementation(() => Promise.resolve('mockToken'));

      const tokens = await authService.refresh();

      expect(mockSign).toHaveBeenCalledTimes(2);
      expect(tokens).toEqual({
        accessToken: 'mockToken',
        refreshToken: 'mockToken',
      });
    });
  });
});
