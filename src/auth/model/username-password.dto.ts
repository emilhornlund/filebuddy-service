import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) representing the user's login credentials.
 */
export class UsernamePasswordDto {
  /**
   * The username of the user.
   * @ApiProperty Decorator that adds metadata for Swagger API.
   */
  @ApiProperty({
    description: 'Username used for login.',
    required: true,
  })
  username: string;

  /**
   * The password of the user.
   * @ApiProperty Decorator that adds metadata for Swagger API.
   */
  @ApiProperty({
    description: 'User password.',
    required: true,
  })
  password: string;
}
