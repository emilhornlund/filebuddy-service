import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) representing the token response from the server.
 */
export class TokenResponse {
  /**
   * The access token used for user authentication.
   * @ApiProperty Decorator that adds metadata for Swagger API.
   */
  @ApiProperty({
    name: 'access_token',
    description: 'Access token for user authentication.',
    required: true,
  })
  accessToken: string;

  /**
   * The refresh token used for renewing the access token.
   * @ApiProperty Decorator that adds metadata for Swagger API.
   */
  @ApiProperty({
    name: 'refresh_token',
    description: 'Refresh token used to renew access token.',
    required: true,
  })
  refreshToken: string;
}
