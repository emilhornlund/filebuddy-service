import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) that represents a user's login credentials.
 */
export class UsernamePasswordDto {
  /**
   * The username of the user.
   * @ApiProperty Decorator that adds metadata for Swagger API.
   */
  @ApiProperty()
  username: string;

  /**
   * The password of the user.
   * @ApiProperty Decorator that adds metadata for Swagger API.
   */
  @ApiProperty()
  password: string;
}
