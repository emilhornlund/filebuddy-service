import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Authorities, Public } from '../decorator/security';
import { UsernamePasswordDto } from '../model/request';
import { TokenResponse } from '../model/response';
import { AuthoritiesDto } from '../model/security';
import { AuthService } from '../service';

/**
 * Controller responsible for managing authentication operations including token generation and refresh.
 *
 * @ApiTags Defines Swagger API tags for a class.
 * @Controller Specifies a controller and its associated path.
 */
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  /**
   * Constructs an instance of AuthController.
   *
   * @param authService An instance of AuthService to manage authentication operations.
   */
  constructor(private authService: AuthService) {}

  /**
   * Authenticates a user using their username and password, then generates an access and refresh token.
   *
   * @ApiOperation Defines a Swagger API operation with a summary and a description.
   * @ApiResponse Defines the type and description of the Swagger API response.
   * @Public Marks a method as public.
   * @HttpCode Specifies the HTTP status code.
   * @Post Specifies the HTTP method and the path it handles.
   *
   * @param usernamePasswordDto Object containing user's login credentials.
   *
   * @returns A Promise that resolves to the user's access and refresh tokens.
   */
  @ApiOperation({
    summary: 'User Authentication',
    description:
      'Validates user credentials and generates access and refresh tokens.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Authentication was successful. Returns access and refresh tokens.',
    type: TokenResponse,
  })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('token')
  authenticate(
    @Body() usernamePasswordDto: UsernamePasswordDto,
  ): Promise<TokenResponse> {
    return this.authService.authenticate(
      usernamePasswordDto.username,
      usernamePasswordDto.password,
    );
  }

  /**
   * Refreshes a user's access token.
   *
   * @ApiBearerAuth Marks a method that requires Swagger API Bearer Auth.
   * @ApiOperation Defines a Swagger API operation with a summary and a description.
   * @ApiResponse Defines the type and description of the Swagger API response.
   * @Authorities Specifies the required authority to execute a method.
   * @HttpCode Specifies the HTTP status code.
   * @Post Specifies the HTTP method and the path it handles.
   *
   * @returns A Promise that resolves to the user's refreshed access and refresh tokens.
   */
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Token Refresh',
    description: "Refreshes the user's access token using the refresh token.",
  })
  @ApiResponse({
    status: 200,
    description:
      'Token refresh was successful. Returns refreshed access and refresh tokens.',
    type: TokenResponse,
  })
  @Authorities(AuthoritiesDto.REFRESH)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refresh(): Promise<TokenResponse> {
    return this.authService.refresh();
  }
}
