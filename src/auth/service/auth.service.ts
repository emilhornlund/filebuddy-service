import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

import { AuthoritiesDto, JwtPayloadDto, TokenDto } from '../model';

/**
 * Service to manage authentication operations such as signing JWTs and authentication users.
 *
 * @injectable
 */
@Injectable()
export class AuthService {
  /**
   * Constructs an instance of AuthService.
   *
   * @param configService The service to retrieve configuration variables.
   * @param jwtService The service to sign JWTs.
   */
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  /**
   * Authenticates a user given a username and password.
   *
   * @param username The user's username.
   * @param password The user's password.
   *
   * @returns The JWT tokens for the authenticated user.
   *
   * @throws {UnauthorizedException} If the username or password are incorrect.
   */
  public async authenticate(
    username: string,
    password: string,
  ): Promise<TokenDto> {
    const rootUsername = this.configService.get<string>(
      'SECURITY_ROOT_USERNAME',
    );
    const rootPassword = this.configService.get<string>(
      'SECURITY_ROOT_PASSWORD',
    );

    if (username !== rootUsername || password !== rootPassword) {
      throw new UnauthorizedException();
    }

    return {
      accessToken: await this.signJwt(rootUsername, 'access'),
      refreshToken: await this.signJwt(rootUsername, 'refresh'),
    };
  }

  /**
   * Refreshes JWT tokens.
   *
   * @returns The new JWT tokens.
   */
  public async refresh(): Promise<TokenDto> {
    const rootUsername = this.configService.get<string>(
      'SECURITY_ROOT_USERNAME',
    );

    return {
      accessToken: await this.signJwt(rootUsername, 'access'),
      refreshToken: await this.signJwt(rootUsername, 'refresh'),
    };
  }

  /**
   * Signs a JWT for a user.
   *
   * @param username The user's username.
   * @param type The type of token to sign. Can be either 'access' or 'refresh'.
   *
   * @returns The signed JWT.
   */
  private async signJwt(
    username: string,
    type: 'access' | 'refresh',
  ): Promise<string> {
    const expiresIn = this.configService.get<string | number>(
      `SECURITY_JWT_${type.toUpperCase()}_EXPIRES_IN`,
    );

    const payload: JwtPayloadDto = {
      authorities:
        type === 'access'
          ? [AuthoritiesDto.FILE_MANAGEMENT, AuthoritiesDto.LIBRARY_MANAGEMENT]
          : [AuthoritiesDto.REFRESH],
    };

    return this.jwtService.signAsync(payload, {
      jwtid: uuidv4(),
      expiresIn,
      subject: username,
    });
  }
}
