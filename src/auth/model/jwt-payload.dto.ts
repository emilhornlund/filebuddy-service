import { AuthoritiesDto } from './authorities.dto';

/**
 * Interface representing the payload of a JWT.
 */
export interface JwtPayloadDto {
  /** Array of authorities the bearer of the JWT has */
  authorities: AuthoritiesDto[];
}
