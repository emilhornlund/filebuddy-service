import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) that represents a token response from the server.
 */
export class TokenDto {
  /**
   * The access token for authentication.
   * @ApiProperty Decorator that adds metadata for Swagger API.
   */
  @ApiProperty({ name: 'access_token' })
  accessToken: string;

  /**
   * The refresh token for renewing the access token.
   * @ApiProperty Decorator that adds metadata for Swagger API.
   */
  @ApiProperty({ name: 'refresh_token' })
  refreshToken: string;
}
