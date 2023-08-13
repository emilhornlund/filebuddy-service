import { SetMetadata } from '@nestjs/common';

/**
 * @module
 * Sets the metadata for public access of an endpoint.
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
