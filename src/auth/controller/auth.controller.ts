import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Authorities, Public } from '../decorator';
import { AuthoritiesDto, TokenDto, UsernamePasswordDto } from '../model';
import { AuthService } from '../service';

/**
 * Controller to handle authentication operations such as token generation and refreshing.
 *
 * @ApiTags Marks a class with Swagger API tags.
 * @Controller Specifies a controller and the path it handles.
 */
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  /**
   * Constructs an instance of AuthController.
   *
   * @param authService The service to handle authentication operations.
   */
  constructor(private authService: AuthService) {}

  /**
   * Authenticates a user and generates tokens.
   *
   * @ApiResponse Defines a Swagger API response with the type of the response.
   * @Public Marks a method as public.
   * @HttpCode Specifies the HTTP status code.
   * @Post Specifies a post method and the path it handles.
   *
   * @param usernamePasswordDto The username and password of the user.
   *
   * @returns A Promise that will resolve to the tokens of the authenticated user.
   */
  @ApiResponse({ type: TokenDto })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('token')
  authenticate(
    @Body() usernamePasswordDto: UsernamePasswordDto,
  ): Promise<TokenDto> {
    return this.authService.authenticate(
      usernamePasswordDto.username,
      usernamePasswordDto.password,
    );
  }

  /**
   * Refreshes a user's tokens.
   *
   * @ApiBearerAuth Marks a method with Swagger API Bearer Auth.
   * @ApiResponse Defines a Swagger API response with the type of the response.
   * @Authorities Marks a method with the required authority to execute it.
   * @HttpCode Specifies the HTTP status code.
   * @Post Specifies a post method and the path it handles.
   *
   * @param jwtPayload The payload of the JWT of the user.
   *
   * @returns A Promise that will resolve to the refreshed tokens of the user.
   */
  @ApiBearerAuth()
  @ApiResponse({ type: TokenDto })
  @Authorities(AuthoritiesDto.REFRESH)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refresh(): Promise<TokenDto> {
    return this.authService.refresh();
  }
}
