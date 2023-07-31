import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { AUTHORITIES_KEY, IS_PUBLIC_KEY } from '../decorator';
import { AuthoritiesDto, JwtPayloadDto } from '../model';

/**
 * Guard to protect routes and validate JWTs.
 *
 * @injectable
 */
@Injectable()
export class AuthGuard implements CanActivate {
  /**
   * Constructs an instance of AuthGuard.
   *
   * @param jwtService The service to validate JWTs.
   * @param reflector Reflector to read the metadata of the handlers.
   */
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  /**
   * Determines whether or not the current user can activate this route.
   *
   * @param context The execution context.
   *
   * @returns A boolean indicating whether or not the user can access this route.
   *
   * @throws {UnauthorizedException} If no JWT is provided or the JWT is invalid.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayloadDto>(
        token,
        {},
      );
      request.jwt = payload;
    } catch {
      throw new UnauthorizedException();
    }

    const requiredAuthorities = this.reflector.getAllAndOverride<
      AuthoritiesDto[]
    >(AUTHORITIES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredAuthorities) {
      return true;
    }

    return requiredAuthorities.some(
      (authority) => request.jwt.authorities?.includes(authority),
    );
  }

  /**
   * Extracts the token from the header of the request.
   *
   * @param request The HTTP request.
   *
   * @returns The JWT from the Authorization header, if exists.
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
