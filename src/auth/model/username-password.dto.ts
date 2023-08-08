import { ApiProperty } from '@nestjs/swagger';

import { IsPassword, IsUsername } from '../decorator';

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
  @IsUsername()
  username: string;

  /**
   * The password of the user.
   * @ApiProperty Decorator that adds metadata for Swagger API.
   */
  @ApiProperty({
    description: 'User password.',
    required: true,
  })
  @IsPassword()
  password: string;
}
