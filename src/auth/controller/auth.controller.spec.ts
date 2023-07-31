import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from '../service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            authenticate: jest.fn(),
            refresh: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('authenticate', () => {
    it('should return a token when valid credentials are provided', async () => {
      const tokenDto = {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      };
      const usernamePasswordDto = {
        username: 'root',
        password: 'password',
      };

      jest.spyOn(authService, 'authenticate').mockResolvedValue(tokenDto);

      expect(await authController.authenticate(usernamePasswordDto)).toEqual(
        tokenDto,
      );
    });

    it('should throw UnauthorizedException when invalid credentials are provided', async () => {
      const usernamePasswordDto = {
        username: 'wrongUser',
        password: 'wrongPassword',
      };

      jest.spyOn(authService, 'authenticate').mockImplementation(() => {
        throw new UnauthorizedException();
      });

      try {
        await authController.authenticate(usernamePasswordDto);
      } catch (err) {
        expect(err).toBeInstanceOf(UnauthorizedException);
        expect(err.message).toEqual('Unauthorized');
      }
    });
  });

  describe('refresh', () => {
    it('should return refreshed tokens', async () => {
      const tokenDto = {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      };

      jest.spyOn(authService, 'refresh').mockResolvedValue(tokenDto);

      expect(await authController.refresh()).toEqual(tokenDto);
    });
  });
});
