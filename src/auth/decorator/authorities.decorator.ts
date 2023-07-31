import { SetMetadata } from '@nestjs/common';

import { AuthoritiesDto } from '../model';

/**
 * @module
 * Sets the metadata for the authorities of an endpoint.
 */
export const AUTHORITIES_KEY = 'authorities';
export const Authorities = (...authorities: AuthoritiesDto[]) =>
  SetMetadata(AUTHORITIES_KEY, authorities);
