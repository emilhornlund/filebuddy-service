import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { Request } from 'express';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let jwtService: JwtService;
  let reflector: Reflector;
  let context: ExecutionContext;
  let request: Partial<Request>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthGuard,
        { provide: JwtService, useValue: { verifyAsync: jest.fn() } },
        Reflector,
      ],
    }).compile();

    authGuard = moduleRef.get<AuthGuard>(AuthGuard);
    jwtService = moduleRef.get<JwtService>(JwtService);
    reflector = moduleRef.get<Reflector>(Reflector);

    request = {
      headers: { authorization: 'Bearer TOKEN' },
    };

    context = {
      switchToHttp: () => ({
        getRequest: () => request as Request,
      }),
      getClass: jest.fn(),
      getHandler: jest.fn(),
    } as unknown as ExecutionContext;
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });

  it('should pass if public route', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(true);
    expect(await authGuard.canActivate(context)).toBeTruthy();
  });

  it('should fail if no token provided', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(false);

    context.switchToHttp = jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        headers: { authorization: '' },
      } as Request),
    });

    await expect(authGuard.canActivate(context)).rejects.toThrow();
  });

  it('should fail if invalid token provided', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(false);
    jest.spyOn(jwtService, 'verifyAsync').mockImplementation(() => {
      throw new Error();
    });
    await expect(authGuard.canActivate(context)).rejects.toThrow();
  });

  it('should pass if valid token provided and no authorities required', async () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValueOnce(false) // For isPublic
      .mockReturnValueOnce(undefined); // For requiredAuthorities

    context.switchToHttp = jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        headers: { authorization: 'Bearer VALID_TOKEN' },
      } as Request),
    });

    jest
      .spyOn(jwtService, 'verifyAsync')
      .mockResolvedValue({ authorities: [] });

    await expect(authGuard.canActivate(context)).resolves.toBeTruthy();
  });

  it('should fail if valid token provided but wrong authorities', async () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValueOnce(false) // For isPublic
      .mockReturnValueOnce(['WRONG_AUTHORITY']); // For requiredAuthorities

    context.switchToHttp = jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        headers: { authorization: 'Bearer VALID_TOKEN' },
      } as Request),
    });

    jest
      .spyOn(jwtService, 'verifyAsync')
      .mockResolvedValue({ authorities: ['RIGHT_AUTHORITY'] });

    await expect(authGuard.canActivate(context)).resolves.toBeFalsy();
  });

  it('should pass if valid token provided and correct authorities', async () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(['RIGHT_AUTHORITY']);
    jest
      .spyOn(jwtService, 'verifyAsync')
      .mockResolvedValue({ authorities: ['RIGHT_AUTHORITY'] });
    expect(await authGuard.canActivate(context)).toBeTruthy();
  });
});
