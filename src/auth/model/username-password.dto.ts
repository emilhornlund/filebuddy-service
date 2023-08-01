import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

/**
 * Data Transfer Object (DTO) representing the user's login credentials.
 */
export class UsernamePasswordDto {
  /**
   * The username of the user.
   * @ApiProperty Decorator that adds metadata for Swagger API.
   * @IsNotEmpty Decorator that ensures the field is not empty.
   */
  @ApiProperty({
    description: 'Username used for login.',
    required: true,
  })
  @IsNotEmpty()
  username: string;

  /**
   * The password of the user.
   * @ApiProperty Decorator that adds metadata for Swagger API.
   * @IsNotEmpty Decorator that ensures the field is not empty.
   */
  @ApiProperty({
    description: 'User password.',
    required: true,
  })
  @IsNotEmpty()
  password: string;
}
